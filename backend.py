import os
import nest_asyncio
from langchain.document_loaders.sitemap import SitemapLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.embeddings.openai import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
# from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
# from langchain.llms import OpenAI
# from langchain_community.llms import OpenAI
from langchain_openai import OpenAI

nest_asyncio.apply()
os.environ["OPENAI_API_KEY"] = "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"

docsearch = None

def load_documents():
    global docsearch
    if docsearch is None:
        loader = SitemapLoader(
            "C:\\Users\\iffat\\OneDrive - Qatar University\\CS\\Fall2023\\CMPS493\\sdp2324-cs-f-24\\Murshidi\\Sitemap2.xml",
            is_local=True, continue_on_failure=True)
        # filter_urls=["https://ind.nl/en"]

        docs = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=50,
            chunk_overlap=0.1,
            length_function=len,
        )

        docs_chunks = text_splitter.split_documents(docs)
        embeddings = OpenAIEmbeddings()
        docsearch = Chroma.from_documents(docs, embeddings)

    return docsearch

def obtain_result(query, docsearch):
    docs = docsearch.similarity_search(query)

    llm = OpenAI()
    original_query = query
    max_completion_length = 300  # You can adjust this value based on your needs

    # Truncate the completion text if it exceeds the maximum length
    truncated_query = original_query[:max_completion_length]

    qa_with_sources = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=docsearch.as_retriever(), return_source_documents=True)

    result = qa_with_sources.invoke({"query": truncated_query})

    print(result["result"])
    # print(result["source_documents"])

# Example usage:
loaded_docsearch = load_documents()
query_example = "what are the career Opportunities for Computer Science students"
obtain_result(query_example, loaded_docsearch)
