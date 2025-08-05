// src/services/OfflineService.ts
{/*
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { firebaseService } from '../config/firebase';

interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: string;
  docId?: string;
  data: any;
  timestamp: number;
}

class OfflineService {
  private isOnline = true;
  private operationQueue: QueuedOperation[] = [];
  private readonly QUEUE_KEY = '@operation_queue';

  async initialize() {
    // Cargar cola de operaciones pendientes
    await this.loadQueue();

    // Monitorear conexión
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected || false;

      // Si volvemos a estar online, procesar cola
      if (wasOffline && this.isOnline) {
        this.processQueue();
      }
    });

    // Procesar cola si ya estamos online
    if (this.isOnline) {
      this.processQueue();
    }
  }

  async queueOperation(operation: Omit<QueuedOperation, 'id' | 'timestamp'>) {
    const queuedOp: QueuedOperation = {
      ...operation,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    this.operationQueue.push(queuedOp);
    await this.saveQueue();

    // Si estamos online, procesar inmediatamente
    if (this.isOnline) {
      this.processQueue();
    }

    return queuedOp.id;
  }

  private async processQueue() {
    if (!this.isOnline || this.operationQueue.length === 0) return;

    const operations = [...this.operationQueue];
    const processedIds: string[] = [];

    for (const operation of operations) {
      try {
        await this.executeOperation(operation);
        processedIds.push(operation.id);
      } catch (error) {
        console.error('Error processing queued operation:', error);
        // Mantener la operación en la cola para reintento
      }
    }

    // Remover operaciones procesadas exitosamente
    this.operationQueue = this.operationQueue.filter(
      op => !processedIds.includes(op.id)
    );
    
    await this.saveQueue();
  }

  private async executeOperation(operation: QueuedOperation) {
    const { type, collection, docId, data } = operation;

    switch (type) {
      case 'create':
        return await firebaseService.addDocument(collection, data);
      case 'update':
        if (!docId) throw new Error('docId required for update');
        return await firebaseService.updateDocument(collection, docId, data);
      case 'delete':
        if (!docId) throw new Error('docId required for delete');
        return await firebaseService.deleteDocument(collection, docId);
    }
  }

  private async loadQueue() {
    try {
      const queueData = await AsyncStorage.getItem(this.QUEUE_KEY);
      if (queueData) {
        this.operationQueue = JSON.parse(queueData);
      }
    } catch (error) {
      console.error('Error loading operation queue:', error);
    }
  }

  private async saveQueue() {
    try {
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.operationQueue));
    } catch (error) {
      console.error('Error saving operation queue:', error);
    }
  }

  getQueuedOperationsCount(): number {
    return this.operationQueue.length;
  }

  isConnected(): boolean {
    return this.isOnline;
  }
}

export const offlineService = new OfflineService();
*/}