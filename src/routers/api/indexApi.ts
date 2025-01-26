import axios from "axios";
import { Router, Request, Response } from "express";

const router = Router();

router.get("/njir", async (req: Request, res: Response) => {
  try {
    // Simulasi fake loading (misalnya 2 detik)
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // Ambil data dari API eksternal
    const response = await axios.get("https://reqres.in/api/users?page=2");

    // Kirim data ke client setelah delay
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

export default router;
