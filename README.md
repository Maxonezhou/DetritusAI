# Github Organization
DetritusAI, DetritusAI2, and DetritusAI-Obj contain the source code for the NodeMCU microcontrollers used in this project. The microcontroller handled the capacity of each garbage can using time-of-flight sensor, the motors used to open and close the garbage and recycling containers, and utilized Solace PubSub+ Cloud Message Brokering platform as the middleware for all communication. <br>

.py files contain the image classification algorithm <br>


# DetritusAI
MakeUofT2020 - A novel solution for smart city urban waste collection. DetritusAI aims to help improve urban waste collection through two main ways. First, IoT enabled garbage and recycling containers have are outfitted with a camera that classifies objects as either waste or recycling. After the classification, the appropriate container (garbgage or recycling) will automatically open and prompt the user to dispose of their waste in the selected container. Each container is outfitted with time-of-flight sensors which are used to detect how full each garbage can is. This information is sent over Solace PubSub+ Platform which is picked up by our ReactJS frontend. The second part of this project utilizes this information to perform <strong> route optimization to help optimize the garbage collection routes based on how full each waste container is as well as the distance between full waste containers. We then provide drivers with turn-by-turn directions to help direct drivers on the optimal route for garbage collection. </strong> 

# Inspiration
The issue of waste management is something that many people view as trivial yet is one of the fundamental factors that will decide the liveability of the world. Yet even in Canada, a developed country, only 9% of plastics are recycled, meaning that the equivalent of 24 CN towers of recyclable plastic enters our landfills each year. In developing nations, this is an even more serious issue that can have profound impacts on quality of life.

# How we built it
When users place an object near the garbage can, a time of flight sensor detects the object and triggers an image classification algorithm that identifies the category of the waste. A message is sent via Solace, which instructs the garbage can to open the appropriate lid.

Within the garbage cans, the time of flight sensors continuously determines the capacity of the bin and communicates that information via Solace to the client-side application.

Using the Google Directions API, the optimal route for garbage collection is determined by factoring in traffic, distance, and the capacity of each bin. An optimal route is displayed on the dashboard, along with turn by turn directions.

# Awards
Winner of Best use of Solace PubSub+ Platform. <br>
Winner of Best use of Google Cloud Platform.
