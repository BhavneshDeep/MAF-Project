import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Loader2, CreditCard, Landmark, UploadCloud, CheckCircle2, ShieldAlert, Sparkles, Smartphone, Share2 } from 'lucide-react';

const localPaymentDetails = {
  bankTransfer: {
    accountName: 'Maheshwari Action Forum (MAF)',
    accountNumber: '1092-79013456-03',
    bankName: 'Habib Bank Limited (HBL)',
    iban: 'PK21HABB0010927901345603',
    branch: 'Shahrah-e-Faisal Branch, Karachi',
    branchCode: '1092',
  },
  easypaisa: {
    number: '0333-2895648',
    accountHolder: 'Bhevish Kumar (General Secretary MAF)',
  },
  jazzCash: {
    number: '0301-3829465',
    accountHolder: 'Bhunesh Kumar (Vice President MAF)',
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const donationSchema = z.object({
  donor_name: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  payment_method: z.enum(['easypaisa', 'jazzcash', 'bank_transfer'], {
    errorMap: () => ({ message: "Select a payment channel" })
  }),
  transaction_id: z.string().min(6, 'Transaction ID must be at least 6 digits/characters'),
});

type DonationFormData = z.infer<typeof donationSchema>;

export default function Donations() {
  const [activeChannel, setActiveChannel] = useState<'easypaisa' | 'jazzcash' | 'bank_transfer'>('bank_transfer');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 1000,
      payment_method: 'bank_transfer',
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFileError("Only PNG, JPG, JPEG, and WEBP receipt formats are accepted");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("Receipt image size must not exceed 5MB");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleChannelSwitch = (channel: 'easypaisa' | 'jazzcash' | 'bank_transfer') => {
    setActiveChannel(channel);
    setValue('payment_method', channel);
  };

  const onSubmit = async (data: DonationFormData) => {
    if (!selectedFile) {
      setFileError("Please upload an image screenshot of your transaction proof");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Upload proof file to Supabase Storage (resolves to Base64 data URL fallback if bucket is missing)
      const proofUrl = await api.uploadDonationProof(selectedFile);

      // 2. Write Donation log into Database
      await api.createDonation({
        donor_name: data.donor_name,
        email: data.email,
        amount: data.amount,
        currency: 'PKR', // Swapped to PKR to reflect domestic NGO operations
        payment_method: data.payment_method,
        transaction_id: data.transaction_id,
        proof_url: proofUrl,
      });

      toast.success('Donation proof submitted successfully!');
      setSubmitSuccess(true);
      setSelectedFile(null);
      reset();
    } catch (error: any) {
      console.error('Donation proof upload error:', error);
      toast.error(error.message || 'Failed to submit donation record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="donations" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative details */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-rose-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-medium mb-4 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Support Humanity & Save Lives</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-6">
            Support Our Mission
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Maheshwari Action Forum executes food drives, disaster relief, and school sponsorships through your generous charity. Review our manual portals and submit your payment verification proof below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Instructions Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-left flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                <Landmark className="w-6 h-6 mr-2 text-rose-600" />
                Select Channel
              </h3>
              
              <div className="grid grid-cols-3 gap-2 mb-8">
                <button
                  onClick={() => handleChannelSwitch('bank_transfer')}
                  className={`py-3 px-1 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1.5
                    ${activeChannel === 'bank_transfer'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/10'
                      : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}
                >
                  <Landmark className="w-5 h-5" />
                  <span>Bank Transfer</span>
                </button>
                
                <button
                  onClick={() => handleChannelSwitch('easypaisa')}
                  className={`py-3 px-1 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1.5
                    ${activeChannel === 'easypaisa'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                      : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Easypaisa</span>
                </button>
                
                <button
                  onClick={() => handleChannelSwitch('jazzcash')}
                  className={`py-3 px-1 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1.5
                    ${activeChannel === 'jazzcash'
                      ? 'bg-rose-800 text-white border-rose-800 shadow-md shadow-rose-800/10'
                      : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>JazzCash</span>
                </button>
              </div>

              {/* Conditional Instructions Render */}
              <div className="space-y-6">
                {activeChannel === 'bank_transfer' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-3.5 text-sm">
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-400 font-medium">Bank Name</span>
                        <span className="text-gray-800 font-bold">{localPaymentDetails.bankTransfer.bankName}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-400 font-medium">Account Title</span>
                        <span className="text-gray-800 font-bold">{localPaymentDetails.bankTransfer.accountName}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-gray-200/60 pb-2">
                        <span className="text-gray-400 font-medium">Account Number</span>
                        <span className="text-gray-800 font-black tracking-wider text-right">{localPaymentDetails.bankTransfer.accountNumber}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-gray-200/60 pb-2">
                        <span className="text-gray-400 font-medium">IBAN Number</span>
                        <span className="text-gray-800 font-black tracking-wider text-xs text-right break-all">{localPaymentDetails.bankTransfer.iban}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 pt-1">
                        <span>Branch: {localPaymentDetails.bankTransfer.branch}</span>
                        <span>Code: {localPaymentDetails.bankTransfer.branchCode}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeChannel === 'easypaisa' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-5 space-y-4 text-sm">
                      <div className="flex flex-col items-center justify-center p-3 bg-emerald-600 text-white rounded-xl mb-2">
                        <Smartphone className="w-8 h-8 mb-1" />
                        <span className="font-bold text-lg">{localPaymentDetails.easypaisa.number}</span>
                        <span className="text-xs text-emerald-100">Easypaisa Mobile Wallet</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-emerald-800/60 text-xs font-bold uppercase tracking-wider">Account Title</span>
                        <span className="text-emerald-950 font-black text-base">{localPaymentDetails.easypaisa.accountHolder}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeChannel === 'jazzcash' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-rose-50/40 rounded-2xl border border-rose-100 p-5 space-y-4 text-sm">
                      <div className="flex flex-col items-center justify-center p-3 bg-rose-900 text-white rounded-xl mb-2">
                        <Smartphone className="w-8 h-8 mb-1" />
                        <span className="font-bold text-lg">{localPaymentDetails.jazzCash.number}</span>
                        <span className="text-xs text-rose-200">JazzCash Mobile Wallet</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-rose-800/60 text-xs font-bold uppercase tracking-wider">Account Title</span>
                        <span className="text-rose-950 font-black text-base">{localPaymentDetails.jazzCash.accountHolder}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instruction Warning Info */}
            <div className="bg-rose-50/60 border border-rose-100/70 p-5 rounded-2xl flex items-start gap-3.5 text-left text-xs text-rose-900 shrink-0">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-extrabold uppercase tracking-wide block mb-1">Verify Before Sending</span>
                Please double check Account Titles and numbers prior to committing transfers. After initiating payments, note down the transaction ID and capture a clear screenshot of the confirmation page to upload.
              </div>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 text-left h-full flex flex-col justify-between">
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 flex-1">
                  <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-bounce" />
                  <div>
                    <h3 className="text-3xl font-black text-gray-900">Thank You, Donor!</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                      Your payment proof has been successfully logged with status **'Pending Verification'**. Our accounts secretary will audit the Transaction ID. You will receive email updates.
                    </p>
                  </div>
                  <div className="flex gap-4 w-full justify-center">
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-md shadow-rose-600/10 transition-colors"
                    >
                      Submit Another Donation
                    </button>
                    <a
                      href="https://wa.me/923332895648?text=Hi+MAF%2C+I+have+submitted+a+donation+proof+on+the+website."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-sm text-gray-700 transition-all flex items-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Notify via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-5">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center">
                      <CreditCard className="w-6 h-6 mr-2 text-rose-600" />
                      Submit Payment Verification
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Donor Full Name</label>
                        <input
                          {...register('donor_name')}
                          type="text"
                          placeholder="e.g. Sagar Karmani"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-semibold"
                        />
                        {errors.donor_name && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.donor_name.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="e.g. donor@domain.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-semibold"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Donated Amount (PKR)</label>
                        <input
                          {...register('amount', { valueAsNumber: true })}
                          type="number"
                          placeholder="e.g. 5000"
                          min="1"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-black"
                        />
                        {errors.amount && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.amount.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Payment Channel Selected</label>
                        <select
                          {...register('payment_method')}
                          value={activeChannel}
                          onChange={(e) => handleChannelSwitch(e.target.value as any)}
                          className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-bold"
                        >
                          <option value="bank_transfer">Habib Bank Ltd (HBL)</option>
                          <option value="easypaisa">Easypaisa Wallet</option>
                          <option value="jazzcash">JazzCash Wallet</option>
                        </select>
                        {errors.payment_method && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.payment_method.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Transaction ID / Reference Number</label>
                      <input
                        {...register('transaction_id')}
                        type="text"
                        placeholder="e.g. TRX901847289 or 271849204"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-black tracking-wider"
                      />
                      {errors.transaction_id && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.transaction_id.message}</p>}
                    </div>

                    {/* Receipt Screenshot Upload Box */}
                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Upload Transaction Receipt Image</label>
                      <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-rose-500 transition-colors flex flex-col items-center justify-center text-center bg-gray-50/50">
                        <input
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(',')}
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                        {selectedFile ? (
                          <div className="space-y-1">
                            <p className="text-emerald-600 text-sm font-bold">File Selected!</p>
                            <p className="text-gray-500 text-xs truncate max-w-xs">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-gray-600 text-sm font-bold">Drag and drop or click to upload</p>
                            <p className="text-gray-400 text-xs">Supports PNG, JPG, JPEG or WEBP (Max 5MB)</p>
                          </div>
                        )}
                      </div>
                      {fileError && <p className="text-red-500 text-xs mt-1.5 font-semibold">{fileError}</p>}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center bg-rose-600 hover:bg-rose-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-md shadow-rose-600/10 hover:shadow-lg"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      {isSubmitting ? 'Uploading Proof...' : 'Verify Donation Transfer'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
