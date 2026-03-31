ALLOWED_EXTENSIONS = [".pdf"]
MAX_FILE_SIZE_MB = 50
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

def validate_file_extension(filename: str) -> bool:
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)

def validate_file_size(file_bytes: bytes) -> bool:
    return len(file_bytes) <= MAX_FILE_SIZE_BYTES

def validate_doc_type(doc_type: str) -> bool:
    allowed_types = [
        "general",
        "rental_agreement",
        "contract",
        "notice",
        "government_form",
        "employment_contract"
    ]
    return doc_type in allowed_types