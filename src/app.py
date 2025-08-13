# app.py
import streamlit as st
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from prompts.conversational_prompt import prompt, extracted_prompt, new_promptt, time_extraction_prompt
from utils.jsontocsv import process_data_and_save
from utils.slotchange import clean_and_parse_json, update_appointment_from_dict
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

st.set_page_config(page_title="Hospital Assistant", layout="centered")
st.title("🏥 Hospital Appointment Assistant")

option = st.selectbox("Choose an action:", ["Select", "BOOK", "CHANGE"])

if option == "BOOK":
    st.subheader("📅 Book an Appointment")
    if "chat_history_book" not in st.session_state:
        st.session_state.chat_history_book = ""
        st.session_state.messages_book = []
        st.session_state.booking_done = False
        # Initial greeting
        initial_msg = "👩‍⚕️ Receptionist: Hello! I'm here to help you book an appointment."
        st.session_state.messages_book.append({"role": "assistant", "content": initial_msg})

    for msg in st.session_state.messages_book:
        st.chat_message(msg["role"]).markdown(msg["content"])

    if not st.session_state.booking_done:
        user_input = st.chat_input("You:")
        if user_input:
            st.session_state.messages_book.append({"role": "user", "content": user_input})

            # Booking response
            conversational_prompt = PromptTemplate(
                input_variables=["chat_history", "user_input"],
                template=prompt
            )
            chain = conversational_prompt | llm
            response = chain.invoke({
                "chat_history": st.session_state.chat_history_book,
                "user_input": user_input
            })
            bot_reply = response.content
            st.session_state.messages_book.append({"role": "assistant", "content": bot_reply})
            st.chat_message("assistant").markdown(bot_reply)
            st.session_state.chat_history_book += f"\nUser: {user_input}\nReceptionist: {bot_reply}"

            # End condition
            if user_input.lower() in ["done", "exit", "quit", "that's all"]:
                extraction_prompt = PromptTemplate(
                    input_variables=["chat_history"],
                    template=extracted_prompt
                )
                extraction_chain = extraction_prompt | llm
                final_response = extraction_chain.invoke({"chat_history": st.session_state.chat_history_book})
                process_data_and_save(final_response.content)
                st.success("✅ Appointment saved!")
                st.session_state.booking_done = True

elif option == "CHANGE":
    st.subheader("🔄 Change an Appointment")
    if "chat_history_change" not in st.session_state:
        st.session_state.chat_history_change = ""
        st.session_state.messages_change = []
        st.session_state.change_done = False
        # Initial greeting
        initial_msg = "👩‍⚕️ Receptionist: Hello! I'm here to help you change your appointment."
        st.session_state.messages_change.append({"role": "assistant", "content": initial_msg})

    for msg in st.session_state.messages_change:
        st.chat_message(msg["role"]).markdown(msg["content"])

    if not st.session_state.change_done:
        user_input = st.chat_input("You:")
        if user_input:
            st.session_state.messages_change.append({"role": "user", "content": user_input})

            conversational_prompt = PromptTemplate(
                input_variables=["chat_history", "user_input"],
                template=new_promptt
            )
            chain = conversational_prompt | llm
            response = chain.invoke({
                "chat_history": st.session_state.chat_history_change,
                "user_input": user_input
            })
            bot_reply = response.content
            st.session_state.messages_change.append({"role": "assistant", "content": bot_reply})
            st.chat_message("assistant").markdown(bot_reply)
            st.session_state.chat_history_change += f"\nUser: {user_input}\nReceptionist: {bot_reply}"

            if user_input.lower() in ["done", "exit", "quit", "that's all"]:
                extraction_prompt = PromptTemplate(
                    input_variables=["chat_history"],
                    template=time_extraction_prompt
                )
                extraction_chain = extraction_prompt | llm
                structured_response = extraction_chain.invoke({"chat_history": st.session_state.chat_history_change})
                parsed_data = clean_and_parse_json(structured_response.content)
                update_appointment_from_dict(parsed_data, csv_path="appointments.csv")
                st.success("✅ Appointment updated!")
                st.session_state.change_done = True

