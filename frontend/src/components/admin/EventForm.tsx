// frontend/src/components/events/EventForm.tsx
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CREATE_EVENT, UPDATE_EVENT } from "../../lib/graphql/events";

interface EventFormData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  address: string;
  maxParticipants: number;
  price: number | null;
  memberPrice: number | null;
  imageUrl: string;
  tags: string[];
  requirements: string;
  additionalInfo: string;
  isPublic: boolean;
  allowWaitlist: boolean;
}

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: Partial<EventFormData>;
  eventId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultFormData: EventFormData = {
  title: "",
  description: "",
  shortDescription: "",
  category: "SOCIAL",
  type: "FREE",
  startDate: "",
  endDate: "",
  registrationDeadline: "",
  location: "",
  address: "",
  maxParticipants: 50,
  price: null,
  memberPrice: null,
  imageUrl: "",
  tags: [],
  requirements: "",
  additionalInfo: "",
  isPublic: true,
  allowWaitlist: true,
};

export const EventForm: React.FC<EventFormProps> = ({
  mode,
  initialData,
  eventId,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  const [tagInput, setTagInput] = useState("");

  const [createEvent, { loading: creating }] = useMutation(CREATE_EVENT, {
    onCompleted: (data) => {
      onSuccess?.();
      navigate(`/admin/events/${data.createEvent.id}`);
    },
    onError: (error) => {
      console.error("Error creating event:", error);
    },
  });

  const [updateEvent, { loading: updating }] = useMutation(UPDATE_EVENT, {
    onCompleted: () => {
      onSuccess?.();
      if (eventId) {
        navigate(`/admin/events/${eventId}`);
      }
    },
    onError: (error) => {
      console.error("Error updating event:", error);
    },
  });

  const loading = creating || updating;

  // Auto-set end date when start date changes
  useEffect(() => {
    if (formData.startDate && !formData.endDate) {
      setFormData((prev) => ({ ...prev, endDate: prev.startDate }));
    }
  }, [formData.startDate]);

  // Auto-set registration deadline
  useEffect(() => {
    if (formData.startDate && !formData.registrationDeadline) {
      const startDate = new Date(formData.startDate);
      const deadline = new Date(startDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before
      setFormData((prev) => ({
        ...prev,
        registrationDeadline: deadline.toISOString().slice(0, 16),
      }));
    }
  }, [formData.startDate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : null) : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof EventFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.maxParticipants < 1)
      newErrors.maxParticipants = "Must be at least 1";

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (formData.type === "PAID") {
      if (!formData.price || formData.price <= 0) {
        newErrors.price = "Price is required for paid events";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const input = {
      ...formData,
      tags: formData.tags,
      price: formData.type === "FREE" ? null : formData.price,
      memberPrice: formData.type === "FREE" ? null : formData.memberPrice,
      ...(mode === "edit" && eventId ? { id: eventId } : {}),
    };

    try {
      if (mode === "create") {
        await createEvent({ variables: { createEventInput: input } });
      } else {
        await updateEvent({ variables: { updateEventInput: input } });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Short Description */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description for event cards"
              maxLength={150}
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.shortDescription.length}/150 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SOCIAL">Social</option>
              <option value="CULTURAL">Cultural</option>
              <option value="EDUCATIONAL">Educational</option>
              <option value="SPORTS">Sports</option>
              <option value="TRAVEL">Travel</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="NETWORKING">Networking</option>
              <option value="PARTY">Party</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="CONFERENCE">Conference</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
              <option value="MEMBERS_ONLY">Members Only</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Detailed event description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Date & Time
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.startDate ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.endDate ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>

          {/* Registration Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Deadline
            </label>
            <input
              type="datetime-local"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Location</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Name *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.location ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="e.g., ESN Munich Office"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full address with street, city, postal code"
            />
          </div>
        </div>
      </div>

      {/* Capacity & Pricing */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Capacity & Pricing
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants *
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.maxParticipants ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.maxParticipants && (
              <p className="mt-1 text-sm text-red-600">
                {errors.maxParticipants}
              </p>
            )}
          </div>

          {/* Price */}
          {formData.type === "PAID" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price (€) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ESN Member Price (€)
                </label>
                <input
                  type="number"
                  name="memberPrice"
                  value={formData.memberPrice || ""}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Additional Information
        </h3>

        {/* Image URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any requirements for participants (e.g., age restrictions, documents needed)"
          />
        </div>

        {/* Additional Info */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Information
          </label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any additional information for participants"
          />
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublic"
              className="ml-2 block text-sm text-gray-900"
            >
              Make event public (visible to all users)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowWaitlist"
              name="allowWaitlist"
              checked={formData.allowWaitlist}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="allowWaitlist"
              className="ml-2 block text-sm text-gray-900"
            >
              Allow waitlist when event is full
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel || (() => navigate(-1))}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {mode === "create" ? "Creating..." : "Updating..."}
            </span>
          ) : mode === "create" ? (
            "Create Event"
          ) : (
            "Update Event"
          )}
        </button>
      </div>
    </form>
  );
};
