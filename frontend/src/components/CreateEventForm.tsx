import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Alert } from "./ui/Alert";
import { CREATE_EVENT_MUTATION } from "../lib/graphql/mutations";

// This is a simplified list of categories and types for the UI dropdowns
// These should ideally be fetched from the backend or a shared constants file
const eventCategories = [
  "PARTY",
  "CULTURE",
  "SPORTS",
  "TRIP",
  "SOCIAL",
  "EDUCATION",
  "OTHER",
];

const eventTypes = ["FREE", "PAID", "MEMBERS_ONLY"];

export function CreateEventForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: eventCategories[0],
    type: eventTypes[0],
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: 100,
    price: 0,
    isPublic: true,
  });

  const [createEvent, { loading, error, data }] = useMutation(
    CREATE_EVENT_MUTATION
  );
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, price: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      const { data } = await createEvent({
        variables: {
          createEventInput: {
            ...formData,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
            maxParticipants: parseInt(String(formData.maxParticipants), 10),
            price: parseFloat(String(formData.price)),
          },
        },
      });

      if (data?.createEvent) {
        setSuccessMessage(
          `Event "${data.createEvent.title}" created successfully!`
        );
        // Optional: Redirect to the event details page or event list
        // navigate(`/events/${data.createEvent.id}`);
      }
    } catch (err) {
      // Error is handled by Apollo Client, `error` state will be set
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Event
      </h2>

      {successMessage && (
        <div className="mb-4">
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />
        </div>
      )}

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error.message} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Start Date"
            name="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <Input
            label="End Date"
            name="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {eventCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {eventTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Max Participants"
            name="maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={handleChange}
            min={1}
            required
          />
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handlePriceChange}
            min={0}
          />
        </div>
        <div className="flex items-center">
          <input
            id="isPublic"
            name="isPublic"
            type="checkbox"
            checked={formData.isPublic}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isPublic"
            className="ml-2 block text-sm text-gray-900"
          >
            Make this event public
          </label>
        </div>

        <Button type="submit" loading={loading} disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </div>
  );
}
