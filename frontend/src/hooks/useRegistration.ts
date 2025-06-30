// frontend/src/hooks/useRegistration.ts
import { useState, useCallback } from "react";
import { useMutation, useQuery, ApolloCache } from "@apollo/client";
import {
  REGISTER_FOR_EVENT,
  GET_MY_REGISTRATIONS,
} from "../lib/graphql/registrations";
import {
  GET_EVENT_DETAILS,
  GET_EVENTS_LIST,
  GET_EVENT,
} from "../lib/graphql/events";

interface UseRegistrationOptions {
  eventId: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface RegistrationState {
  isRegistered: boolean;
  isLoading: boolean;
  userRegistration: any;
  register: (options?: {
    specialRequests?: string;
    dietary?: string;
    emergencyContact?: string;
  }) => Promise<void>;
  canRegister: boolean;
  canJoinWaitlist: boolean;
}

export const useRegistration = ({
  eventId,
  onSuccess,
  onError,
}: UseRegistrationOptions): RegistrationState => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Get user's registrations
  const { data: registrationsData, loading: registrationsLoading } = useQuery(
    GET_MY_REGISTRATIONS,
    {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    }
  );

  // Registration mutation with comprehensive cache updates
  const [registerForEvent, { loading: mutationLoading }] = useMutation(
    REGISTER_FOR_EVENT,
    {
      update: (cache: ApolloCache<any>, { data: mutationResult }) => {
        if (mutationResult?.registerForEvent) {
          updateApolloCache(cache, mutationResult.registerForEvent);
        }
      },
      onCompleted: (data) => {
        setIsProcessing(false);
        onSuccess?.(data);
      },
      onError: (error) => {
        setIsProcessing(false);
        onError?.(error);
      },
      refetchQueries: [
        { query: GET_MY_REGISTRATIONS },
        { query: GET_EVENT_DETAILS, variables: { id: eventId } },
      ],
      awaitRefetchQueries: false,
    }
  );

  // Helper function to update Apollo cache
  const updateApolloCache = useCallback(
    (cache: ApolloCache<any>, newRegistration: any) => {
      try {
        // 1. Update GET_MY_REGISTRATIONS cache
        const existingRegistrations = cache.readQuery({
          query: GET_MY_REGISTRATIONS,
        });

        if (existingRegistrations) {
          cache.writeQuery({
            query: GET_MY_REGISTRATIONS,
            data: {
              myRegistrations: [
                newRegistration,
                ...(existingRegistrations.myRegistrations || []),
              ],
            },
          });
        }

        // 2. Update event-specific caches
        const updateEventInCache = (query: any, variables?: any) => {
          try {
            const existingData = cache.readQuery({ query, variables });
            if (existingData?.event) {
              cache.writeQuery({
                query,
                variables,
                data: {
                  event: {
                    ...existingData.event,
                    registrationCount: newRegistration.event.registrationCount,
                    waitlistCount: newRegistration.event.waitlistCount,
                    isRegistered: true,
                    canRegister: false,
                  },
                },
              });
            }
          } catch (e) {
            // Cache miss is fine
          }
        };

        // Update various event queries
        updateEventInCache(GET_EVENT_DETAILS, { id: eventId });
        updateEventInCache(GET_EVENT, { id: eventId });

        // 3. Update events list
        try {
          const existingEventsList = cache.readQuery({
            query: GET_EVENTS_LIST,
            variables: {},
          });

          if (existingEventsList?.events) {
            const updatedEvents = existingEventsList.events.map((e: any) =>
              e.id === eventId
                ? {
                    ...e,
                    registrationCount: newRegistration.event.registrationCount,
                    waitlistCount: newRegistration.event.waitlistCount,
                    isRegistered: true,
                    canRegister: false,
                  }
                : e
            );

            cache.writeQuery({
              query: GET_EVENTS_LIST,
              variables: {},
              data: { events: updatedEvents },
            });
          }
        } catch (e) {
          // Cache miss is fine
        }
      } catch (error) {
        console.error("Error updating Apollo cache:", error);
      }
    },
    [eventId]
  );

  // Find user's registration for this event
  const userRegistration = registrationsData?.myRegistrations?.find(
    (reg: any) => reg.event.id === eventId && reg.status !== "CANCELLED"
  );

  const isRegistered = !!userRegistration;
  const isLoading = registrationsLoading || mutationLoading || isProcessing;

  // Registration handler
  const register = useCallback(
    async (
      options: {
        specialRequests?: string;
        dietary?: string;
        emergencyContact?: string;
      } = {}
    ) => {
      if (isProcessing || mutationLoading) return;

      setIsProcessing(true);

      try {
        await registerForEvent({
          variables: {
            createRegistrationInput: {
              eventId,
              registrationType: "REGULAR", // Backend will determine if it should be waitlist
              ...options,
            },
          },
        });
      } catch (error) {
        setIsProcessing(false);
        throw error;
      }
    },
    [eventId, registerForEvent, isProcessing, mutationLoading]
  );

  return {
    isRegistered,
    isLoading,
    userRegistration,
    register,
    canRegister: !isRegistered,
    canJoinWaitlist: !isRegistered, // Backend will handle waitlist logic
  };
};

interface RegistrationStatus {
  isRegistered: boolean;
  registration: any | null;
  isLoading: boolean;
  error: any;
  canRegister: boolean;
  registrationStatus:
    | "NONE"
    | "CONFIRMED"
    | "PENDING"
    | "WAITLISTED"
    | "CANCELLED";
}
export const useRegistrationStatus = (eventId: string): RegistrationStatus => {
  const { data, loading, error } = useQuery(GET_MY_REGISTRATIONS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Find registration for this specific event
  const registration = data?.myRegistrations?.find(
    (reg: any) => reg.event.id === eventId && reg.status !== "CANCELLED"
  );

  const isRegistered = !!registration;
  const canRegister = !isRegistered;
  const registrationStatus = registration?.status || "NONE";

  return {
    isRegistered,
    registration,
    isLoading: loading,
    error,
    canRegister,
    registrationStatus,
  };
};

// Helper function to get registration status display info
export const getRegistrationStatusInfo = (status: string) => {
  const statusConfig = {
    CONFIRMED: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      icon: "✅",
      title: "Registration Confirmed",
      color: "green",
    },
    PENDING: {
      bg: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-800",
      icon: "⏳",
      title: "Registration Pending",
      color: "yellow",
    },
    WAITLISTED: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      icon: "⏰",
      title: "On Waitlist",
      color: "blue",
    },
    CANCELLED: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      icon: "❌",
      title: "Registration Cancelled",
      color: "red",
    },
    NONE: {
      bg: "bg-gray-50 border-gray-200",
      text: "text-gray-800",
      icon: "📝",
      title: "Not Registered",
      color: "gray",
    },
  };

  return statusConfig[status as keyof typeof statusConfig] || statusConfig.NONE;
};
