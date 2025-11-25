export interface ProfileFormData {
    firstName: string;
    lastName: string;
    phone: string;
    university: string;
    nationality: string;
    chapter: string;
    bio: string;
    telegram: string;
    instagram: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
}

export interface NotificationSettings {
    emailEvents: boolean;
    emailReminders: boolean;
    emailNewsletter: boolean;
    emailPromotions: boolean;
    pushEvents: boolean;
    pushReminders: boolean;
    pushUpdates: boolean;
    smsReminders: boolean;
}

export interface PrivacySettings {
    profileVisible: boolean;
    showEmail: boolean;
    showPhone: boolean;
    showUniversity: boolean;
    allowMessages: boolean;
}

export interface Registration {
    id: string;
    status: string;
    event: {
        id: string;
        title: string;
        startDate: string;
        endDate: string;
        status: string;
        location: string;
        images: string[];
    };
}
