import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation signin($email: String!, $password: String!) {
    signin(input: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup($name: String!, $email: String!, $password: String!) {
    signup(input: {
      name: $name,
      email: $email,
      password: $password,
    }) {
      id
      name
      email
    }
  }
`;

export const GET_CHATS = gql`
  query{
    getChats {
      user {
        id
        name
      }
      lastMessage
      lastMessageTime
      unreadCount
    }
  }
`;

export const GET_CHAT_USERS = gql`
  query {
    getChatUsers {
      id
      name
      email
    }
  }
`;

export const GET_CHAT_HISTORY = gql`
  query getChatHistory($otherUserId: String!){
    getChatHistory(otherUserId: $otherUserId) {
      id
      senderId
      message
      read
      createdAt
      formattedCreatedAt
      user {
        id
        name
      }
    }
  }
`;

export const GET_USER_DETAIL = gql`
  query getUserDetail($id: String!) {
    getUserDetail(id: $id) {
      id
      name
      email
      online
      lastSeen
      formattedLastSeen
    }
  }
`;
