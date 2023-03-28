const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbpath = path.join(__dirname, "cricketTeam.db");

let db = null;
const intialize_server_db = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server running http://localhost/3000/players/");
    });
  } catch (msg) {
    console.log(`DB error ${msg.message}`);
    process.exit(1);
  }
};
intialize_server_db();

app.get("/players/", async (request, Response) => {
  const teamquery = `
    SELECT
    *
    FROM
    cricket_team
    `;
  const playerlist = await db.all(teamquery);
  Response.send(playerlist);
});

//post method
app.post("/players/", async (request,response)=>{
    const playersdetails = request.body
    const {player_id,player_name, jersey_number, role}= playersdetails
    const add_player_query = `
    INSERT INTO 
    cricket_team 
    ( player_name, jersey_number, role)
    VALUES(
        ${player_name}, ${jersey_number}, ${role}
        );
    `
    const dbresponse =await db.run(add_player_query)
    const playerId = dbresponse.lastID
    response.send({player_id:playerId})

//getplayer

app.get("/players/:playerId/", async (request, Response) => {
  const { playerId } = request.params;
  const get_query = `
    SELECT 
    * 
    FROM 
    cricket_team
    WHERE player_id = ${playerId}
    `;
  const player_details = await db.get(get_query);
  Response.send(player_details);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatedeatils = request.body;

  const { player_name, jersey_number, role } = updatedeatils;

  const updateQuery = `
     UPDATE 
     cricket_team
     SET
     player_name = ${player_name},
     jersey_number = ${jersey_number},
     role = ${role}
     WHERE player_id= ${playerId}`;

  const dbresponse = await db.run(updateQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:player_Id/", async (request, response) => {
  const { player_Id } = request.params;

  const delplayerQuery = `
    DELETE 
    FROM
    cricket_team
    WHERE player_id= ${player_Id}
    `;
  const deltedresponse = await db.run(delplayerQuery);
  response.send("Player Removed");
});
