import getpass
import os
import json



from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.prompts import PromptTemplate
from src.prompts.conversational_prompt import new_promptt,time_extraction_prompt
from src.utils.slotchange import  clean_and_parse_json, update_appointment_from_dict

from dotenv import load_dotenv
load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
    
)    

from langchain_core.runnables import RunnableSequence
def changing(y:str):
    conversational_prompt = PromptTemplate(
    input_variables=["chat_history", "user_input"],
    template=new_promptt)
  # or OpenAI(temperature=0) if using older model

# Chain using RunnableSequence (| syntax)
    chain = conversational_prompt | llm
    chat_history = ""

    print("Receptionist: Hello!there")

    while True:
        user_input = input("You: ")

        if user_input.lower() in ["done", "exit", "quit", "that's all"]:
            print("Receptionist: Thank you! Your appointment has been noted. Goodbye!")
            break

    # Fill the prompt with current chat history and user input
        response = chain.invoke({
        "chat_history": chat_history,
        "user_input": user_input
    })

    # Get reply and print
        print("Receptionist:", response.content)

    # Update chat history
        chat_history += f"\nUser: {user_input}\nReceptionist: {response.content}"
    extraction_prompt = PromptTemplate(
    input_variables=["chat_history"],
    template=time_extraction_prompt
)

    extraction_chain = extraction_prompt | llm

    structured_response = extraction_chain.invoke({"chat_history":chat_history})
    print(structured_response.content) 
    data=structured_response.content
    data=clean_and_parse_json(data)

    update_appointment_from_dict(data, csv_path="appointments.csv")
    