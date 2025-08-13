from langchain_community.document_loaders import TextLoader

def load_consultation_schedule(file_path: str) -> str:
    """
    Load doctor consultation schedule from a text file and return the combined content.
    
    Args:
        file_path (str): Path to the consultation schedule text file.

    Returns:
        str: Combined page content from the file.
    """
    loader = TextLoader(file_path)
    documents = loader.load()
    context_text = "\n\n".join(doc.page_content for doc in documents)
    return context_text
