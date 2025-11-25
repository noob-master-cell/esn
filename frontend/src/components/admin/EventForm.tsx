// frontend/src/components/events/EventForm.tsx
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CREATE_EVENT, UPDATE_EVENT } from "../../graphql/events";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { MultiImageUpload } from "../ui/MultiImageUpload";
import { useAuth } from "../../hooks/useAuth";

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
  images: string[];
  tags: string[];
  requirements: string;
  additionalInfo: string;
  isPublic: boolean;
  status: "DRAFT" | "PUBLISHED";
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
  images: [],
  tags: [],
  requirements: "",
  additionalInfo: "",
  isPublic: true,
  status: "DRAFT",
};

const CATEGORY_OPTIONS = [
  { value: "SOCIAL", label: "Social" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "EDUCATIONAL", label: "Educational" },
  { value: "SPORTS", label: "Sports" },
  { value: "TRAVEL", label: "Travel" },
  { value: "VOLUNTEER", label: "Volunteer" },
  { value: "NETWORKING", label: "Networking" },
  { value: "PARTY", label: "Party" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "OTHER", label: "Other" },
];

const TYPE_OPTIONS = [
  { value: "FREE", label: "Free" },
  { value: "PAID", label: "Paid" },
  { value: "MEMBERS_ONLY", label: "Members Only" },
];

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
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [tagInput, setTagInput] = useState("");
  const { getToken } = useAuth();

  const [createEvent, { loading: creating }] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      onSuccess?.();
      navigate("/admin/events");
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      alert(`Failed to create event: ${error.message}`);
    },
  });

  const [updateEvent, { loading: updating }] = useMutation(UPDATE_EVENT, {
    onCompleted: () => {
      onSuccess?.();
      if (eventId) {
        navigate("/admin/events");
      }
    },
    onError: (error) => {
      console.error("Error updating event:", error);
      alert(`Failed to update event: ${error.message}`);
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
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <Input
                label="Event Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={errors.title}
                placeholder="Enter event title"
              />
            </div>

            <div className="lg:col-span-2">
              <Input
                label="Short Description"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief description for event cards"
                maxLength={150}
              />
              <p className="mt-1 text-xs text-gray-500 text-right">
                {formData.shortDescription.length}/150 characters
              </p>
            </div>

            <Select
              label="Category *"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={CATEGORY_OPTIONS}
            />

            <Select
              label="Event Type *"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={TYPE_OPTIONS}
              helperText={
                formData.type === "PAID"
                  ? "Payments will be collected manually."
                  : undefined
              }
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: "DRAFT", label: "Draft" },
                { value: "PUBLISHED", label: "Published" },
              ]}
              helperText="Published events are visible to everyone."
            />
          </div>

          <Textarea
            label="Full Description *"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            rows={6}
            placeholder="Detailed event description"
          />
        </div>
      </Card>

      {/* Date & Time */}
      <Card>
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Date & Time
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Input
              type="datetime-local"
              label="Start Date & Time *"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              error={errors.startDate}
            />

            <Input
              type="datetime-local"
              label="End Date & Time *"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              error={errors.endDate}
            />

            <Input
              type="datetime-local"
              label="Registration Deadline"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </Card>

      {/* Location */}
      <Card>
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Location
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Location Name *"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              error={errors.location}
              placeholder="e.g., ESN Munich Office"
            />

            <Input
              label="Full Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Full address with street, city, postal code"
            />
          </div>
        </div>
      </Card>

      {/* Capacity & Pricing */}
      <Card>
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Capacity & Pricing
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Input
              type="number"
              label="Max Participants *"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              min={1}
              error={errors.maxParticipants}
            />

            {formData.type === "PAID" && (
              <>
                <Input
                  type="number"
                  label="Regular Price (€) *"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  min={0}
                  step="0.01"
                  error={errors.price}
                />

                <Input
                  type="number"
                  label="ESN Member Price (€)"
                  name="memberPrice"
                  value={formData.memberPrice || ""}
                  onChange={handleInputChange}
                  min={0}
                  step="0.01"
                />
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <Card>
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Additional Information
          </h3>

          <div className="space-y-4">
            <MultiImageUpload
              label="Event Images"
              value={formData.images}
              onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
              onUpload={async (file) => {
                const token = await getToken();
                const formData = new FormData();
                formData.append('file', file);

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';
                const uploadUrl = apiUrl.replace('/graphql', '/upload');

                const response = await fetch(uploadUrl, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                  body: formData,
                });
                if (!response.ok) throw new Error('Upload failed');
                const data = await response.json();
                return data.url;
              }}
              maxImages={5}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="info"
                    className="flex items-center gap-1 pr-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  label=""
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  placeholder="Add a tag"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddTag} variant="secondary">
                  Add
                </Button>
              </div>
            </div>

            <Textarea
              label="Requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any requirements for participants (e.g., age restrictions, documents needed)"
            />

            <Textarea
              label="Additional Information"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional information for participants"
            />
          </div>
        </div>
      </Card>

      {/* Visibility Settings */}
      <Card>
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Visibility & Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isPublic"
                  name="isPublic"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={handleCheckboxChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isPublic" className="font-medium text-gray-700">
                  Public Event
                </label>
                <p className="text-gray-500">
                  {formData.isPublic
                    ? "This event is open for everyone and visible to all users."
                    : "This event is private and only visible to admins."}
                </p>
              </div>
            </div>


          </div>
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel || (() => navigate(-1))}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Create Event" : "Update Event"}
        </Button>
      </div>
    </form>
  );
};
