import { NOTE_FRAGMENT } from "./fragments";
import { GET_NOTES } from "./queries";
// import { saveNotes, restoreNotes } from "./offline";

export const defaults = {
    notes: [
        {
            __typename: "Note",
            id: 1,
            title: "hello",
            content: "world"
        }
    ]
};

export const typeDefs = [
    `
    schema {
        query: Query
        mutation: Mutation
    }
    type Query {
        notes: [Note]!
        note(id: Int!): Note
    }
    type Mutation{
        createNote(title: String!, content: String!): Note
        editNote(id: Int!, title: String, content:String): Note
    }
    type Note{
        id: Int!
        title: String!
        content: String!
    }
    `
];

export const resolvers = {
    Query: { // 가져오기 (readable?)
        note: (_, variables, { cache } ) => {
            // console.log(cache, variables);
            const id = cache.config.dataIdFromObject({
                __typename: "Note",
                id: variables.id
            });
            const note = cache.readFragment( { fragment: NOTE_FRAGMENT, id } );
            // https://www.apollographql.com/docs/react/advanced/caching.html#readfragment
            return note;
        }
    },
    Mutation: { // 상태변화 (writeable?)
        createNote: (_, variables, { cache }) => {
            const { notes } = cache.readQuery({ query: GET_NOTES });
            // https://www.apollographql.com/docs/react/advanced/caching.html#readquery
            const { title, content } = variables;
            const newNote = {
              __typename: "Note",
              title,
              content,
              id: notes.length + 1 // 이러면 안되지 않나? = delete가 없네...
            };
            cache.writeData({
              data: {
                notes: [newNote, ...notes]
              }
            });
            // saveNotes(cache);
            return newNote;
        }, 
        editNote: (_, { id, title, content }, { cache }) => {
            console.log(id, title, content);
            const noteId = cache.config.dataIdFromObject({
              __typename: "Note",
              id
            });
            const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id: noteId });
            const updatedNote = {
              ...note,
              title,
              content
            };
            cache.writeFragment({
              id: noteId,
              fragment: NOTE_FRAGMENT,
              data: updatedNote
            });
            // saveNotes(cache);
            console.log(updatedNote);
            return updatedNote;
        }
    }
};