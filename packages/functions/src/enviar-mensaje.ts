interface HandleInput {
    messajeId: string;
}

interface HandleOutput {
    messajeId: string;
}

export const handler = async (input: HandleInput): Promise<HandleOutput> => {
    console.log("input", input)

    // manda mensaje
    // guarda estado de envio
    return {
        messajeId: input.messajeId,
    };
};
