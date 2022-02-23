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
