import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import { io, type Socket } from 'socket.io-client';
import { socketPath } from "url";
import useNotificationsStore from "./notificationsStore";
import { type NotificationCategory, Notification, NoticeData } from "@models/notificationsStoreTypes";

export interface MessagesState {
    
}