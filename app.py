from tkinter import *
import mimetypes
from xml.dom.minidom import Document
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
from flask import Flask, jsonify, render_template, request
import os
import nest_asyncio
from langchain.document_loaders.sitemap import SitemapLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_openai import OpenAI
from langchain.text_splitter import TokenTextSplitter
from flask_cors import CORS
import speech_recognition as sr

nest_asyncio.apply()
openai_api_key  = "sk-proj-QLeNzXYi7SVyJmMxMpCiT3BlbkFJ2p8glu7xSVgrKbHYLJmJ"

app = Flask(__name__,  static_url_path='/static')
CORS(app)

app.config['MIME_TYPES'] = {'application/javascript': ['.js']}

qa_with_sources=None
isInitialized=False

def initialize_chatbot():
        global qa_with_sources
        # loader = SitemapLoader(
        #     "C:\\Users\\iffat\OneDrive - Qatar University\\CS\\Fall2023\\CMPS493\\sdp2324-cs-f-24\\SDP2324-CS-F-24-Murshidi\\Sitemap2.xml", is_local=True, continue_on_failure=True)

        # docs = loader.load()

        # Assuming your text file contains the document text separated by newlines
        fileContents=""
        with open("C:\\Users\\iffat\\OneDrive - Qatar University\\CS\\Fall2023\\CMPS493\\sdp2324-cs-f-24\\SDP2324-CS-F-24-Murshidi\\QUdata.txt", "r", encoding="utf-8") as file:
        # Read the contents of the text file
            fileContents = file.read()

        paragraphs=fileContents.split('\n\n')

        # text_splitter = TokenTextSplitter(
        #     chunk_size=5000,
        #     chunk_overlap=100,
        #     length_function=len,
        # )

        # docs_chunks = text_splitter.split_documents(docs)
        embeddings = OpenAIEmbeddings()
        # docsearch = Chroma.from_documents(docs_chunks, embeddings)
        docsearch=Chroma.from_texts(paragraphs, embeddings)
        retrieval_parameters = {
        "chunk_similarity_threshold": 0.7,  # Adjust based on desired similarity threshold
        "chunk_match_threshold": 0.7,        # Adjust based on desired match threshold
        "chunk_top_k": 2                    # Adjust based on the desired number of top matches
    }

        llm = OpenAI(temperature=0.9)
        qa_with_sources = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=docsearch.as_retriever(**retrieval_parameters),
        return_source_documents=True
    )

with app.app_context():
    initialize_chatbot()
    isInitialized=True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contactus')
def contact_us():
    return render_template('contactus.html')

@app.route("/api/Murshidi", )    
def query_chatbot():
    global isInitialized
    query = request.args.get("query", type=str)
    if not isInitialized:
        initialize_chatbot()
        isInitialized=True
    max_completion_length = 500
    # Truncate the completion text if it exceeds the maximum length
    truncated_query = query[:max_completion_length]
    num_results = 1  # Adjust this value based on functionality
    result = qa_with_sources.invoke({"query": truncated_query, "num_results": num_results}) 
    data = {"result": result['result']}
    return jsonify(data)