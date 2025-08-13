import streamlit as st
import os
import pandas as pd
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence

from prompts.conversational_prompt import prompt, extracted_prompt
from utils.jsontocsv import process_data_and_save

load_dotenv()

# Set up Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# Prepare prompts
conversational_prompt = PromptTemplate(
    input_variables=["chat_history", "user_input"],
    template=prompt
)

extraction_prompt = PromptTemplate(
    input_variables=["chat_history"],
    template=extracted_prompt
)

chat_chain = conversational_prompt | llm
extraction_chain = extraction_prompt | llm

st.title("🩺 AI Hospital Receptionist")

# Session State Initialization
if "chat_history" not in st.session_state:
    st.session_state.chat_history = ""

if "last_response" not in st.session_state:
    st.session_state.last_response = ""

# Chat Input
user_input = st.text_input("You:", key="input")

if user_input:
    if user_input.lower() in ["done", "exit", "quit", "that's all"]:
        st.success("✅ Thank you! Extracting and saving your appointment details...")

        # Extract structured data
        structured_response = extraction_chain.invoke({
            "chat_history": st.session_state.chat_history
        })

        content = structured_response.content.strip()

        # Save to CSV
        process_data_and_save(content)

        # Show updated CSV
        if os.path.exists("appointments.csv"):
            df = pd.read_csv("appointments.csv")
            st.subheader("📄 Saved Appointments")
            st.dataframe(df)

    else:
        # Get AI response
        response = chat_chain.invoke({
            "chat_history": st.session_state.chat_history,
            "user_input": user_input
        })

        ai_reply = response.content.strip()

        # Show current interaction
        st.markdown(f"**Receptionist:** {ai_reply}")

        # Update state
        st.session_state.chat_history += f"\nUser: {user_input}\nReceptionist: {ai_reply}"
        st.session_state.last_response = ai_reply



    