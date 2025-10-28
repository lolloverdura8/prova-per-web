import React from "react";
import "../styles/NotificationItem.css"; // Importo gli stili per il componente
import { Card, CardContent, Typography } from "@mui/material";
// Componente per mostrare una singola notifica
const NotificationItem = ({ notification }) => {
    // Estraggo i dati dalla notifica ricevuta come props
    const { actorId, type, preview } = notification;
    const actorUsername = actorId?.username || "Qualcuno";

    // Funzione per decidere il messaggio da mostrare a seconda del tipo di notifica
    const renderMessage = () => {
        switch (type) {
            case "like":
                return `${actorUsername} ha messo mi piace al tuo post.`;
            case "comment":
                return (
                    <>
                        {actorUsername} ha commentato il tuo post:
                        <br />
                        <em>"{preview}"</em> {/* Mostro l'anteprima del commento */}
                    </>
                );
            default:
                return "Hai una nuova notifica.";
        }
    };

    return (
        <Card className="notification-item" sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="body1">{renderMessage()}</Typography>
            </CardContent>
        </Card>
    );
};

export default NotificationItem;
