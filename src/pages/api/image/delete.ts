import { type NextApiRequest, type NextApiResponse } from "next";
import { getSession } from "next-auth/react";


export default function handler(req: NextApiRequest, res: NextApiResponse) {

	if (req.method != "GET")
		return;

	// Check if the user is authenticate
	// const session = await getSession({ req });
	// if (!session) {
	// 	res.status(401).json({ message: 'Not authenticated!' });
	// 	return;
	// }

	res.status(200).json({ message: 'Hello from Next.js!' })
}