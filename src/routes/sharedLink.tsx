import { useParams } from "react-router-dom";
import { queryObjectDecryptor } from "utils/queryObjectEncryptor";



export default function SharedLink() {
    const params = useParams<{ id: string }>();
    const queryObject = queryObjectDecryptor(params?.id || '');
    return (
        <pre>
            {JSON.stringify(queryObject, null, 2)}
        </pre>
    )
}