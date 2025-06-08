import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk'; // Import DynamoDB itself for DocumentClient.UpdateItemInput type
import { documentClient, tableName } from '../../utils/dynamodb';
import { Playlist, Song } from '../../types/data'; // Adjust path
import { v4 as uuidv4 } from 'uuid';

const commonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Adjust for production
};

// Mock User ID for now - replace with actual auth context later
const getUserIdFromEvent = (event: APIGatewayProxyEvent): string | null => {
    // return event.requestContext.authorizer?.claims.sub; // Example for Cognito
    return event.pathParameters?.userId || 'mock-user-123'; // Fallback for now
};

export const createPlaylist = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserIdFromEvent(event);
    if (!userId) return { statusCode: 401, headers: commonHeaders, body: JSON.stringify({ message: 'Unauthorized' }) };

    const { name, songs } = JSON.parse(event.body || '{}') as { name: string, songs?: Song[] };
    if (!name) return { statusCode: 400, headers: commonHeaders, body: JSON.stringify({ message: 'Playlist name is required' }) };

    const timestamp = new Date().toISOString();
    const playlist: Playlist = {
        userId,
        playlistId: uuidv4(),
        name,
        songs: songs || [],
        createdAt: timestamp,
        updatedAt: timestamp,
    };

    const params = {
        TableName: tableName,
        Item: {
            PK: `USER#${userId}`,
            SK: `PLAYLIST#${playlist.playlistId}`,
            ...playlist,
            EntityType: 'Playlist', // For easier filtering if needed
        },
    };

    try {
        await documentClient.put(params).promise();
        return { statusCode: 201, headers: commonHeaders, body: JSON.stringify(playlist) };
    } catch (error) {
        console.error('Error creating playlist:', error);
        return { statusCode: 500, headers: commonHeaders, body: JSON.stringify({ message: 'Could not create playlist', error: (error as Error).message }) };
    }
};

export const getPlaylistsByUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserIdFromEvent(event);
    if (!userId) return { statusCode: 401, headers: commonHeaders, body: JSON.stringify({ message: 'Unauthorized' }) };

    const params = {
        TableName: tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk_prefix)',
        ExpressionAttributeValues: {
            ':pk': `USER#${userId}`,
            ':sk_prefix': 'PLAYLIST#',
        },
    };
    try {
        const { Items } = await documentClient.query(params).promise();
        return { statusCode: 200, headers: commonHeaders, body: JSON.stringify(Items) };
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return { statusCode: 500, headers: commonHeaders, body: JSON.stringify({ message: 'Could not fetch playlists', error: (error as Error).message }) };
    }
};

export const getPlaylistById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserIdFromEvent(event);
    const playlistId = event.pathParameters?.playlistId;

    if (!userId || !playlistId) return { statusCode: 400, headers: commonHeaders, body: JSON.stringify({ message: 'User ID and Playlist ID are required' }) };

    const params = {
        TableName: tableName,
        Key: {
            PK: `USER#${userId}`,
            SK: `PLAYLIST#${playlistId}`,
        },
    };
    try {
        const { Item } = await documentClient.get(params).promise();
        if (!Item) return { statusCode: 404, headers: commonHeaders, body: JSON.stringify({ message: 'Playlist not found' }) };
        return { statusCode: 200, headers: commonHeaders, body: JSON.stringify(Item) };
    } catch (error) {
        console.error('Error fetching playlist:', error);
        return { statusCode: 500, headers: commonHeaders, body: JSON.stringify({ message: 'Could not fetch playlist', error: (error as Error).message }) };
    }
};

export const updatePlaylist = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserIdFromEvent(event);
    const playlistId = event.pathParameters?.playlistId;
    if (!userId || !playlistId) return { statusCode: 400, headers: commonHeaders, body: JSON.stringify({ message: 'User ID and Playlist ID are required' }) };

    const { name, songs } = JSON.parse(event.body || '{}') as { name?: string, songs?: Song[] };
    if (!name && !songs) return { statusCode: 400, headers: commonHeaders, body: JSON.stringify({ message: 'Name or songs must be provided for update' }) };

    let updateExpression = 'set updatedAt = :updatedAt';
    const expressionAttributeValues: Record<string, any> = { ':updatedAt': new Date().toISOString() };
    const expressionAttributeNames: Record<string, string> = {};

    if (name) {
        updateExpression += ', #playlistName = :name';
        expressionAttributeValues[':name'] = name;
        expressionAttributeNames['#playlistName'] = 'name';
    }
    if (songs) {
        updateExpression += ', songs = :songs';
        expressionAttributeValues[':songs'] = songs;
    }

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: tableName,
        Key: { PK: `USER#${userId}`, SK: `PLAYLIST#${playlistId}` },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
        ConditionExpression: 'attribute_exists(PK)',
    };
    if (Object.keys(expressionAttributeNames).length > 0) {
        params.ExpressionAttributeNames = expressionAttributeNames;
    }

    try {
        const { Attributes } = await documentClient.update(params).promise();
        return { statusCode: 200, headers: commonHeaders, body: JSON.stringify(Attributes) };
    } catch (error: any) {
        if (error.code === 'ConditionalCheckFailedException') {
            return { statusCode: 404, headers: commonHeaders, body: JSON.stringify({ message: 'Playlist not found or condition check failed.' }) };
        }
        console.error('Error updating playlist:', error);
        return { statusCode: 500, headers: commonHeaders, body: JSON.stringify({ message: 'Could not update playlist', error: (error as Error).message }) };
    }
};

export const deletePlaylist = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserIdFromEvent(event);
    const playlistId = event.pathParameters?.playlistId;
    if (!userId || !playlistId) return { statusCode: 400, headers: commonHeaders, body: JSON.stringify({ message: 'User ID and Playlist ID are required' }) };

    const params = {
        TableName: tableName,
        Key: { PK: `USER#${userId}`, SK: `PLAYLIST#${playlistId}` },
    };
    try {
        await documentClient.delete(params).promise();
        return { statusCode: 200, headers: commonHeaders, body: JSON.stringify({ message: 'Playlist deleted successfully' }) };
    } catch (error) {
        console.error('Error deleting playlist:', error);
        return { statusCode: 500, headers: commonHeaders, body: JSON.stringify({ message: 'Could not delete playlist', error: (error as Error).message }) };
    }
};

export const addSongToPlaylist = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserIdFromEvent(event);
    const playlistId = event.pathParameters?.playlistId;
    if (!userId || !playlistId) return { statusCode: 400, headers: commonHeaders, body: JSON.stringify({ message: 'User ID and Playlist ID are required' }) };

    const song = JSON.parse(event.body || '{}') as Song;
    if (!song || !song.id || !song.title) {
        return { statusCode: 400, headers: commonHeaders, body: JSON.stringify({ message: 'Valid song object (id, title) is required' }) };
    }

    const params = {
        TableName: tableName,
        Key: { PK: `USER#${userId}`, SK: `PLAYLIST#${playlistId}` },
        UpdateExpression: 'SET songs = list_append(if_not_exists(songs, :empty_list), :new_song), updatedAt = :updatedAt',
        ExpressionAttributeValues: {
            ':new_song': [song],
            ':empty_list': [],
            ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
        ConditionExpression: 'attribute_exists(PK)',
    };

    try {
        const { Attributes } = await documentClient.update(params).promise();
        return { statusCode: 200, headers: commonHeaders, body: JSON.stringify(Attributes) };
    } catch (error: any) {
         if (error.code === 'ConditionalCheckFailedException') {
            return { statusCode: 404, headers: commonHeaders, body: JSON.stringify({ message: 'Playlist not found.' }) };
        }
        console.error('Error adding song:', error);
        return { statusCode: 500, headers: commonHeaders, body: JSON.stringify({ message: 'Could not add song to playlist', error: (error as Error).message }) };
    }
};

export const removeSongFromPlaylist = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserIdFromEvent(event);
    const { playlistId, songId } = event.pathParameters || {};
    if (!userId || !playlistId || !songId) {
        return { statusCode: 400, headers: commonHeaders, body: JSON.stringify({ message: 'User ID, Playlist ID, and Song ID are required' }) };
    }

    try {
        const getParams = {
            TableName: tableName,
            Key: { PK: `USER#${userId}`, SK: `PLAYLIST#${playlistId}` },
        };
        const { Item } = await documentClient.get(getParams).promise();

        if (!Item || !Item.songs) {
            return { statusCode: 404, headers: commonHeaders, body: JSON.stringify({ message: 'Playlist or songs not found' }) };
        }

        const songs = Item.songs as Song[];
        const updatedSongs = songs.filter(s => s.id !== songId);

        if (songs.length === updatedSongs.length) {
             return { statusCode: 404, headers: commonHeaders, body: JSON.stringify({ message: 'Song not found in playlist' }) };
        }

        const updateParams = {
            TableName: tableName,
            Key: { PK: `USER#${userId}`, SK: `PLAYLIST#${playlistId}` },
            UpdateExpression: 'SET songs = :songs, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':songs': updatedSongs,
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
            ConditionExpression: 'attribute_exists(PK)',
        };

        const { Attributes } = await documentClient.update(updateParams).promise();
        return { statusCode: 200, headers: commonHeaders, body: JSON.stringify(Attributes) };

    } catch (error: any) {
        if (error.code === 'ConditionalCheckFailedException') {
            return { statusCode: 404, headers: commonHeaders, body: JSON.stringify({ message: 'Playlist not found during update.' }) };
        }
        console.error('Error removing song:', error);
        return { statusCode: 500, headers: commonHeaders, body: JSON.stringify({ message: 'Could not remove song from playlist', error: (error as Error).message }) };
    }
};
