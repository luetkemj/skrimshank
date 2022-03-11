220310
Brain and Goals
We have a basic brain that can process a single goal at a time. No planning ahead. We need a brain that has the capacity to plan ahead.

A goal as it currently stands is a single action, just like a bump or interaction event. It's collected by the parent entity, put in a bag and a random event is pulled and fired.

A goal SHOULD be, a collection of 1 or more events, in order, to achieve a single goal. Each event goes on the stack and the brain works through that stack.

If a goblin is hungry, they should fire a getHungry goal types event to all components it has on it's person, in it's inventory, and knows about/can see. Every component that has an onGetHungryGoals listener will add a hungryGoal to the bag. Then the goblin will pull a random hungryGoal, run the calculations to turn that in to one or many events, and then start working through them.

A goblin should look on their immediate body first.
If no events found, look into their inventory.
If no events found, look into what they can see.
If no events found, look into what they know about.
If no events found, do something else/be bored.

A hungry goal may consist of the following. Path to item. Kill/butcher/cook item. Eat item.

220224
events:
bumpInteractions - possible interactions with component on bump
interactions - possible interactions from component in interact
applications - possible applications of an item in inventory with component

playere bumps into door. Door component contains all the logic for bump interactions. On bump the door sends out an event that is called by the bumper
interactions - on moving the cursor over an entity get all possible interaction eveents - for a door, it knows that it can opened or closed in interaction.
applications - a lockpick can be used to open a lock and contains all the logic needed within it to communicate that.

---

addLog should take into account if a thing is iwithin fov or not.
things not in fov could controbute to ambiance as noises...

      addLog([{ str: `You bump into the {{NAME}}` }]);

{{SUBJECT}} {{VERB}} {{OBJECT}}
You bump into the door

---

Earlier

Inversion of control.

door is a component.
locked is a component.

DOOR is an entity that has both the door and locked components.

door has events
try-open
try-close

try-open checks if DOOR has locked
if DOOR has locked
if locked display message

getInteractions

Lockpick
if ()

verbs that item components can implement
Lockpick
use

component is lock
key = id

openLock
if (this.unlocked) return
if (this.interactor has)

---

on bump, get a type of action from the bumpee

on bumpDoor - type=OPEN

fireEvent type=OPEN

lockpick - if type is open and object we're working oon islocked, return
a tryPick action.

if type === OPEN && this.parent.locked

---

Aha! Locks are like combustible and fire :)

A lock can only lock itself.
Door cannot be opened if it has a lock and is locked
A lock pick can unlock a lock
(later on a lock could respond to a break event...)
A lock can be opened or closed

A lock pick introduces:
materials and damage to the lock and the lock pick
skills - ability to lock pick
difficulty - challange of lock pick

lock
if is broke
return false

if is locked

if has key
try unlock

---

For item use events
Item is the interactor
door is the interactee

Gonna have to split these somehow in the UI or in the code
User events are different.
