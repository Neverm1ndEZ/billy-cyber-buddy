# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionHandleEmergency(Action):
    def name(self) -> Text:
        return "action_handle_emergency"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        # Emergency protocol implementation
        dispatcher.utter_message(
            text="I'm very concerned about what you've shared. "
                 "Your safety is the top priority right now."
        )
        
        # Send emergency resources
        dispatcher.utter_message(
            text="Here are immediate resources for help:\n"
                 "- Emergency Services: 911\n"
                 "- Crisis Text Line: Text HOME to 741741\n"
                 "- National Suicide Prevention Lifeline: 1-800-273-8255"
        )
        
        return [SlotSet("emergency_mode", True)]

class ActionPrepareEvidenceCollection(Action):
    def name(self) -> Text:
        return "action_prepare_evidence_collection"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        # Guide user through evidence collection
        dispatcher.utter_message(
            text="It's important to document what's happening. "
                 "Would you like me to help you collect evidence? "
                 "This can include screenshots, messages, or any other proof."
        )
        
        # Set metadata for frontend to handle evidence collection
        return [{
            "metadata": {
                "actionRequired": True,
                "actionType": "collect_evidence"
            }
        }]