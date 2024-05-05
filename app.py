from tkinter import *
from flask import Flask, jsonify, request
import os
import nest_asyncio
from langchain.document_loaders.sitemap import SitemapLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.embeddings.openai import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
# from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
# from langchain_community.llms import OpenAI
# from langchain.llms import OpenAI
from langchain_openai import OpenAI
from langchain.text_splitter import TokenTextSplitter
from flask_cors import CORS

nest_asyncio.apply()
# os.environ["OPENAI_API_KEY"] = "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"
os.environ["OPENAI_API_KEY"] = "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"
# "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"
# "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"

app = Flask(__name__)
CORS(app)

qa_with_sources=None
isInitialized=False

def initialize_chatbot():
        global qa_with_sources
        loader = SitemapLoader(
            "C:\\Users\\iffat\\OneDrive - Qatar University\\CS\\Fall2023\\CMPS493\\sdp2324-cs-f-24\\Murshidi-Final\\Sitemap2.xml",
            is_local=True, continue_on_failure=True)

        docs = loader.load()
        text_splitter = TokenTextSplitter(
            chunk_size=1000000,
            chunk_overlap=500,
            length_function=len,
        )

        docs_chunks = text_splitter.split_documents(docs)
        embeddings = OpenAIEmbeddings()
        docsearch = Chroma.from_documents(docs_chunks, embeddings)
        retrieval_parameters = {
        "chunk_similarity_threshold": 0.8,  # Adjust based on desired similarity threshold
        # "chunk_match_threshold": 0.8,        # Adjust based on desired match threshold
        # "chunk_top_k": 4                    # Adjust based on the desired number of top matches
    }

        llm = OpenAI(temperature=0.8)
        qa_with_sources = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=docsearch.as_retriever(**retrieval_parameters),
        return_source_documents=True
    )

        # llm = OpenAI(temperature=0)
        # qa_with_sources = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=docsearch.as_retriever(), return_source_documents=True)

@app.route("/api/Murshidi")    
def query_chatbot():
    global isInitialized
    query = request.args.get("query", type=str)
    if not isInitialized:
        initialize_chatbot()
        isInitialized=True
    max_completion_length = 600  #adjust this value based on functionality
    # Truncate the completion text if it exceeds the maximum length
    truncated_query = query[:max_completion_length]
    num_results = 1  # Adjust this value based on functionality
    result = qa_with_sources.invoke({"query": truncated_query, "num_results": num_results})
    data = {"result": result['result']}
    return jsonify(data)