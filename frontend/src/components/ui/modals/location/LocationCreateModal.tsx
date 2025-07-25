import React, { useState } from 'react';
import { User, Phone, CreditCard } from 'lucide-react';
import { BaseFormModal, Input } from '../../index';
import { GenderType, GenderTypeLabels } from '../../../../types/api/customerInterface';

interface CustomerCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CustomerFormData) => Promise<void>;
}

interface CustomerFormData {
    firstname: string;
    lastname: string;
    gender: GenderType;
    phoneNumber: string;
    address: string;
    email: string;
    tin: string;
}

const CustomerCreateModal: React.FC<CustomerCreateModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     onSubmit
                                                                 }) => {
    const [formData, setFormData] = useState<CustomerFormData>({
        firstname: '',
        lastname: '',
        gender: GenderType.FEMALE,
        phoneNumber: '',
        address: '',
        email: '',
        tin: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Required fields validation (only firstname and lastname)
        if (!formData.firstname.trim()) {
            newErrors.firstname = 'Το όνομα είναι υποχρεωτικό';
        } else if (formData.firstname.trim().length < 2) {
            newErrors.firstname = 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες';
        }

        if (!formData.lastname.trim()) {
            newErrors.lastname = 'Το επώνυμο είναι υποχρεωτικό';
        } else if (formData.lastname.trim().length < 2) {
            newErrors.lastname = 'Το επώνυμο πρέπει να έχει τουλάχιστον 2 χαρακτήρες';
        }

        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Μη έγκυρη διεύθυνση email';
        }

        if (formData.address.trim() && formData.address.trim().length < 5) {
            newErrors.address = 'Η διεύθυνση πρέπει να έχει τουλάχιστον 5 χαρακτήρες';
        }

        // Optional TIN validation
        if (formData.tin.trim() && !/^\d{9}$/.test(formData.tin.trim())) {
            newErrors.tin = 'Το ΑΦΜ πρέπει να έχει 9 ψηφία';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        await onSubmit(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            firstname: '',
            lastname: '',
            gender: GenderType.FEMALE, // Consistent with initial state
            phoneNumber: '',
            address: '',
            email: '',
            tin: ''
        });
        setErrors({}); // Clear errors on close
        onClose();
    };

    const handleInputChange = (field: keyof CustomerFormData, value: string | GenderType) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear field error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Check if form is valid (for submit button state)
    const isFormValid = formData.firstname.trim().length >= 2 &&
        formData.lastname.trim().length >= 2;

    return (
        <BaseFormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Δημιουργία Νέου Πελάτη"
            onSubmit={handleSubmit}
            submitText="Δημιουργία Πελάτη"
            cancelText="Ακύρωση"
            isValid={isFormValid}
        >
            <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Προσωπικά Στοιχεία
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Όνομα *"
                            value={formData.firstname}
                            onChange={(e) => handleInputChange('firstname', e.target.value)}
                            placeholder="π.χ. Γιάννης"
                            error={errors.firstname}
                        />

                        <Input
                            label="Επώνυμο *"
                            value={formData.lastname}
                            onChange={(e) => handleInputChange('lastname', e.target.value)}
                            placeholder="π.χ. Παπαδόπουλος"
                            error={errors.lastname}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Φύλο
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value as GenderType)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {Object.values(GenderType).map(gender => (
                                <option key={gender} value={gender}>
                                    {GenderTypeLabels[gender]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-green-600" />
                        Στοιχεία Επικοινωνίας
                    </h3>

                    <Input
                        label="Τηλέφωνο"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="π.χ. 6901234567"
                        error={errors.phoneNumber}
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="π.χ. customer@example.com"
                        error={errors.email}
                    />

                    <Input
                        label="Διεύθυνση"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="π.χ. Πατησίων 123, Αθήνα"
                        error={errors.address}
                    />
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                        Επιχειρηματικά Στοιχεία
                    </h3>

                    <Input
                        label="ΑΦΜ (Προαιρετικό)"
                        value={formData.tin}
                        onChange={(e) => handleInputChange('tin', e.target.value)}
                        placeholder="π.χ. 123456789"
                        error={errors.tin}
                    />
                    <p className="text-sm text-gray-500">
                        Το ΑΦΜ είναι υποχρεωτικό για χονδρικούς πελάτες
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Συμβουλή:</strong> Βεβαιωθείτε ότι τα στοιχεία επικοινωνίας είναι σωστά για την καλύτερη εξυπηρέτηση του πελάτη.
                    </p>
                </div>
            </div>
        </BaseFormModal>
    );
};

export default CustomerCreateModal;