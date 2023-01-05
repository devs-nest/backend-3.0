Workflow:

1. Sign-up (userRoutes)
2. Sign-in (userRoutes)
3. Create Schedule (scheduleRoutes)
4. Create Event (eventRoutes)
5. Get schedule (scheduleRoutes)
6. Get all events (eventRoutes)
 
Event book karne ka time hai jo tuu book kar raha: 2 se 2:30
Pehle se ek event book kiya hua hai: 1 se 2:30
Check karna rahega:
Jo event book kar rahe hai apun, uska start time already booked event ke start time se zyaada nahi hona chahiye [ bookend event ka end time < current event ka start time] 


Already Booked Event:    Current Event:
Start Time                  Start Time >= AST && Start Time < AET
End Time                     End Time >= AST && End Time < AET



{ST} || {ET} 

9 se 10 9:15