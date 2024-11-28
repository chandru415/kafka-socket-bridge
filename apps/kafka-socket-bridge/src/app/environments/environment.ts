export const environment = {
  production: false,
  kafkaBrokers: ['mes-broker0.rcmindustries.com:443'],
  kakfaRegisterOptions: {
    name: 'KAFKA_PRODUCER_SERVICE',
    options: {
      client: {
        clientId: 'producer-client',
        brokers: ['mes-broker0.rcmindustries.com:443'], // Update with your Kafka broker
      },
      consumer: {
        groupId: 'consumer-group-id', // Consumer group
      },
    },
  },
  kafkaTopics: ['unifact-topic-1'],
  producerConfig: {
    allowAutoTopicCreation: true, // Automatically create topics if they don't exist
    idempotent: true, // Ensure exactly-once delivery
    acks: 1, // Acknowledgment level: wait for leader to acknowledge (use 'all' for full durability)
    compression: 'lz4', // Compression for better performance
    maxInFlightRequests: 5, // Control number of inflight requests to improve throughput
    lingerMs: 5, // Batch message sends to improve performance
    retries: 5, // Retry in case of failure
  },
  consumerConfig: {
    groupId: 'unifact-consumer', // Consumer group ID
    retry: {
      retries: 5, // Number of retries in case of failure
    },
    allowAutoTopicCreation: true, // Automatically create topics if not present
    sessionTimeout: 30000, // Timeout for session to detect consumer failures
    heartbeatInterval: 3000, // Heartbeat interval to keep consumer group session alive
    maxInFlightRequests: 1, // Ensures message order (important for exactly-once delivery)
    autoCommit: true, // Commit message offsets automatically
    fetchMinBytes: 1, // Minimum amount of data the broker should return
    fetchMaxWaitMs: 500, // Maximum wait time for fetching new messages (for batching)
    isolationLevel: 'read_committed', // Ensures the consumer reads only committed messages in case of transaction
  },
};
