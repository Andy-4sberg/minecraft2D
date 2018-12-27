/////////////////////////////////////////////////////////////////////////////////////////
// .-------------------.
// | NOTES FOR ANDREW: |
// '-------------------'
//
// This is the code for a "2D Minecraft" game that we were making.
//
// It has 4 parts: Setup, Things to keep track of, Draw the things, Change the things.
// The makes it easier to understand and to change to do what you want. For example,
// You can change how to Draw the things (or what the game looks like) without worrying
// about how the game works. Or you can change how the game works without worrying about
// how it gets drawn. If you add something new to the game, then you might have to change
// all parts, but you can do it one at a time. For example, when we made the person crouch,
// we had change how the person is drawn to draw him shorter if he is crouched. For the
// game to know whether the person is crouched or not, we had to add a new variable (in
// "THINGS TO KEEP TRACK OF") to keep track of whether the person is crouched or not.
// To change when the person is crouched, we added code to change the "person.crouched"
// whenever you press the SHIFT key. (We found the key-number for the SHIFT key by pressing
// that key in the game and looking in the console window to see what it said).
//
// HERE ARE THE 4 SECTIONS:
//
// 1. SETUP:
//    This creates the Renderer (and names it "r"), and puts it on the webpage.
//    You can ignore everything in here for now. But for instructions on how to
//    use the renderer, see: https://github.com/d-cook/Render/blob/master/README.md
//
// 2. THINGS TO KEEP TRACK OF:
//    These are all the things (variables) that the program uses to keep track
//    anything that is happening in the game. For example: Where the person is,
//    what all the blocks are, is the person crouching, etc. If you want a new thing
//    to keep track of in the game, you first create a variable for it in this section,
//    and then you change how things are drawn or how the game works to use that variable.
//    For example, if you want the person to have life-hearts, then you can create a
//    variable that has the number of hearts that person has; then you add code to draw
//    the hearts (see "DRAW THE THINGS" below) which uses that variable to know how many
//    hearts to draw; and then you add code to change how many hearts the person has
//    (for example, by subtracting 1 from it when they get hurt) when something happens.
//
// 3. DRAW THE THINGS:
//    This is all the instructions for how to draw the game.
//    The "drawEverything" function creates a new array (or a list) call "thingsToDraw",
//    and passes that into other functions. For example, drawBlocks draws all the blocks
//    by "pushing" drawing instructions for each block into the list of thingsToDraw.
//    DrawPerson pushes instructions for drawing the shapes that make the person.
//    That way, if you just want to change how something is drawn (like the person),
//    you only need to change the code in that function (like drawPerson). Or if you
//    add a new thing to draw, then you can create a new function (like drawPickaxe)
//    and then change drawEverything to also pass the thingsToDraw to that function.
//    Finally, drawEverything is called every 20 milliseconds (or 0.02 seconds), so that
//    no matter what is happening in the game, it very quickly draws what the game should
//    look like on the screen.
//
// 4. CHANGE THE THINGS:
//    The is the code for making things happen when you push buttons or do other things.
//    For example, when you push left or right, move the person left of right. You move
//    the person by changing the variable that is "keeping track" of where the person is
//    standing (person.x). For example, to move left you subtract 1 from it, or to move
//    right you add 1 to it. You do NOT want the person to move if that will make him
//    walk out of the game, so the code says "if you pressed left AND if you are not too
//    far to the left, then move left", or the same thing for moving right. Since had
//    already written the code for how (and where) to draw the person, we didn't need to
//    worry about that anymore, we just had to change the variable that keeps track of
//    where the person is when you push a button, and it keeps drawing it the right way.
//    When we made the person fall down ("if the bloock beneath you is air, then add 1
//    to person.y"), it still just kept drawing him in the right place.
/////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////
// SETUP
////////////////////////////


////////////////////////////
// THINGS TO KEEP TRACK OF
////////////////////////////


////////////////////////////
// DRAW THE THINGS
////////////////////////////


////////////////////////////
// CHANGE THE THINGS
////////////////////////////

