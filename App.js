import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

let db;
const client = new MongoClient("mongodb://localhost:27017");

client.connect()
    .then(() => {
        db = client.db("projectmongodb");
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });

app.get("/", (_, res) => {
    res.send("Welcome to the API!");
});

// ดึงข้อมูลทั้งหมด
app.get("/idname", async (_, res) => {
    try {
        const idnames = await db.collection("idname").find().toArray();
        res.json(idnames);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// ดึงข้อมูลตาม _id (ObjectId)
app.get("/idname/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const idname = await db.collection("idname").findOne({ _id: new ObjectId(id) });
        if (!idname) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json(idname);
    } catch (err) {
        console.error("Error fetching data by ObjectId:", err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// เพิ่มข้อมูลใหม่
app.post("/idname", async (req, res) => {
    try {
        const data = req.body;
        const result = await db.collection("idname").insertOne(data);
        res.json(result.ops[0]);  // ส่งข้อมูลที่เพิ่งเพิ่มไป
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "Failed to insert data" });
    }
});

// แก้ไขข้อมูล
app.put("/idname/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await db.collection("idname").updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json({ message: "Document updated successfully" });
    } catch (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ error: "Failed to update data" });
    }
});

// ลบข้อมูล
app.delete("/idname/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.collection("idname").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        console.error("Error deleting data:", err);
        res.status(500).json({ error: "Failed to delete data" });
    }
});

app.listen(3000, () => {
    console.log("Server started: success");
});
