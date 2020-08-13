// EXAMPLE 1

const { getToken, getTweets, filterTweets } = require("./twitter");

function getHeadlines(screenName) {
    return getToken()
        .then((token) => {
            return getTweets(token, screenName);
        })
        .then(filterTweets);
}

// *** USING ASYNC & AWAIT ***

async function getHeadlines(screenName) {
    try {
        const token = await getToken();
        const tweets = await getTweents(token, screenName);

        return filteredTweets(tweets);
    } catch (error) {
        console.log("ERROR:", error); // Disadvantage: here we wouldn't know what exactly failed.
    }
}

// **********************************************************************************************


// EXAMPLE 2

makePasta().then(()=> {
    makeSauce().then() => {
        grateCheese().then(() => {
            console.log("Dinner Is Ready")
        })
    }
})

// *** USING ASYNC & AWAIT ***

async function makeDinner (){
    try{
        await makePasta();
        await makeSauce();
        await grateCheese()

        console.log("Diiner Is Ready!")

    }catch (error){
        console.log("ERROR: ", error)
    }
}

// *** CoONCURRENT VERSION - RUN THEM ALL AT ONCE! NOT WAIT UNTIL THE PREV ONE FINISHES

async function makeDinner (){
    try{
        const pastaPromise = makePasta();
        const saucePromise = makeSauce();
        const cheesePromise = grateCheese()

        return{ //here we can chosse to return object or array 
            pasta: await makePasta,
            sauce: await makeSauce,
            cheese: await grateCheese,
        }
        //OR (array result)
        // return await Promise.all([pastaPromise, saucePromise, cheesePromise])

        console.log("Diiner Is Ready!")

    }catch (error){
        console.log("ERROR: ", error)
    }
}

// **********************************************************************************************


// EXAMPLE 3

app.post("/registration", (req,res)=>{
    const {first, last, email, password} = req.body;

    hashedPass (password).then(hash =>{
        db.newUser (first, last, email, hash).then(id =>{
            req.session.userId = id;
            res.json({
                success:true
            })
        }).catch(error => {
            console.log("EIIEO IN NEW USER: ", error)
        });
    }).catch(error => {
        console.log("ERROR IN HAHSED PASS: ", error)
    })
})
// *** USING ASYNC & AWAIT ***

app.posr ("/registration", async (req, res) => {
    const {first, last, email, password} = req.body;
 
    try{
        let hash = await hashedPass (password);

        let id = await db.newUser (first, last, email, hash);

        req.session.userId=id;
        res.json({success:true})

    }catch (error){
        console.log("ERROR IN POST REGISTRATION :", error)

    }
})