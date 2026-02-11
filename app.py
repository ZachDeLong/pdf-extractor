from flask import Flask, render_template, request, send_file, jsonify
from pypdf import PdfReader, PdfWriter
import os
import tempfile

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/info', methods=['POST'])
def pdf_info():
    """Get PDF page count"""
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file'}), 400

    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        reader = PdfReader(file)
        return jsonify({'pages': len(reader.pages)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/extract', methods=['POST'])
def extract_pages():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    page_range = request.form.get('pages', '')
    if not page_range:
        return jsonify({'error': 'No page range specified'}), 400

    # Get offset for skipping intro pages (title, TOC, etc.)
    try:
        offset = int(request.form.get('offset', 0) or 0)
    except ValueError:
        offset = 0

    try:
        pages = parse_page_range(page_range)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    # Read the uploaded PDF
    reader = PdfReader(file)
    total_pages = len(reader.pages)

    # Apply offset to page numbers
    adjusted_pages = [p + offset for p in pages]

    # Validate adjusted page numbers
    invalid_pages = [p for p in adjusted_pages if p < 1 or p > total_pages]
    if invalid_pages:
        return jsonify({'error': f'Invalid pages: {invalid_pages}. PDF has {total_pages} pages.'}), 400

    # Create new PDF with selected pages
    writer = PdfWriter()
    for page_num in adjusted_pages:
        writer.add_page(reader.pages[page_num - 1])

    # Save to temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    writer.write(temp_file)
    temp_file.close()

    # Generate output filename
    original_name = os.path.splitext(file.filename)[0]
    output_name = f'{original_name}_pages_{page_range.replace(",", "_").replace(" ", "")}.pdf'

    return send_file(
        temp_file.name,
        as_attachment=True,
        download_name=output_name,
        mimetype='application/pdf'
    )

@app.route('/merge', methods=['POST'])
def merge_pdfs():
    """Merge multiple PDFs into one"""
    files = request.files.getlist('pdfs')

    if len(files) < 2:
        return jsonify({'error': 'Need at least 2 PDFs to merge'}), 400

    # Get the order from form data (comma-separated indices)
    order = request.form.get('order', '')
    if order:
        try:
            indices = [int(i) for i in order.split(',')]
            files = [files[i] for i in indices]
        except (ValueError, IndexError):
            pass  # Use original order if parsing fails

    writer = PdfWriter()

    try:
        for file in files:
            if file.filename == '':
                continue
            reader = PdfReader(file)
            for page in reader.pages:
                writer.add_page(page)
    except Exception as e:
        return jsonify({'error': f'Error reading PDF: {str(e)}'}), 400

    if len(writer.pages) == 0:
        return jsonify({'error': 'No pages to merge'}), 400

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    writer.write(temp_file)
    temp_file.close()

    return send_file(
        temp_file.name,
        as_attachment=True,
        download_name='merged.pdf',
        mimetype='application/pdf'
    )

def parse_page_range(page_range):
    """Parse a page range string like '1-26, 30, 45-50' into a list of page numbers."""
    pages = []
    parts = page_range.replace(' ', '').split(',')

    for part in parts:
        if '-' in part:
            try:
                start, end = part.split('-')
                start, end = int(start), int(end)
                if start > end:
                    raise ValueError(f'Invalid range: {part}')
                pages.extend(range(start, end + 1))
            except ValueError:
                raise ValueError(f'Invalid range format: {part}')
        else:
            try:
                pages.append(int(part))
            except ValueError:
                raise ValueError(f'Invalid page number: {part}')

    return pages

if __name__ == '__main__':
    app.run(debug=True, port=5000)
