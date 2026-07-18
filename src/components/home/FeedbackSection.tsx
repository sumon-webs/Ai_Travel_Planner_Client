'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Chip, Input, Checkbox } from '@heroui/react';
import { Star, MessageSquare, Mail, Send, CheckCircle, Sparkles, Phone, MapPin } from 'lucide-react';

import FormField from '../plan-trip/FormField';
import GlassInput from '../plan-trip/GlassInput';
import GlassTextarea from '../plan-trip/GlassTextarea';

// ── Zod Schema ──
const feedbackSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').optional(),
  rating: z.number().min(1).max(5),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackSection() {
  const [submitted, setSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema) as unknown as Resolver<FeedbackFormValues>,
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      rating: 0,
      message: '',
    },
    mode: 'onSubmit', // Validate only on form submission
  });

  const currentRating = watch('rating');

  const onSubmit = async (data: FeedbackFormValues) => {
    console.log("Submitted");
    setSubmitError(null);
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${serverUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          subject: data.subject,
          message: data.message,
          rating: data.rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      setSubmitted(true);
      reset();
      // Refresh testimonials to show the new feedback
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred while submitting your feedback'
      );
    }
  };

  const handleRatingClick = (rating: number) => {
    setValue('rating', rating);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmitError(null);
    reset();
  };

  return (
    <section
      id="feedback"
      className="relative overflow-hidden bg-slate-950 px-6 py-20 lg:py-28 text-white"
      aria-labelledby="feedback-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-purple-600/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Information Card */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Chip className="bg-white/10 border border-white/20 px-3 h-8">
                <span className="flex items-center gap-2 text-sm text-white">
                  <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                  Your Feedback Matters
                </span>
              </Chip>

              <h2
                id="feedback-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              >
                Help Us{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Improve Your Journey
                </span>
              </h2>

              <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                Share your experience with AI Travel Planner. Your feedback helps us create smarter,
                more personalized travel itineraries for adventurers like you.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email Us</h3>
                  <p className="text-sm text-slate-400">support@aitravelplanner.com</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Call Us</h3>
                  <p className="text-sm text-slate-400">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Visit Us</h3>
                  <p className="text-sm text-slate-400">123 Travel Street, Adventure City</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Feedback Form */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
              {/* Card gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                    <p className="text-slate-400 max-w-sm">
                      Your feedback has been submitted successfully. We appreciate your input and will
                      use it to improve our services.
                    </p>
                    <Button
                      onClick={handleReset}
                      className="mt-4 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-semibold shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:opacity-90 transition cursor-pointer"
                    >
                      Submit Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    {/* Full Name */}
                    <FormField
                      label="Full Name"
                      htmlFor="fullName"
                      error={errors.fullName?.message}
                      required
                    >
                      <GlassInput
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        hasError={!!errors.fullName}
                        {...register('fullName')}
                      />
                    </FormField>

                    {/* Email */}
                    <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
                      <GlassInput
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        autoComplete="email"
                        hasError={!!errors.email}
                        {...register('email')}
                      />
                    </FormField>

                    {/* Subject */}
                    <FormField label="Subject" htmlFor="subject" error={errors.subject?.message}>
                      <GlassInput
                        id="subject"
                        type="text"
                        placeholder="What is your feedback about?"
                        hasError={!!errors.subject}
                        {...register('subject')}
                      />
                    </FormField>

                    {/* Rating */}
                    <FormField label="Rating" htmlFor="rating" error={errors.rating?.message} required>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="p-2 rounded-lg transition-all hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                (hoveredRating || currentRating) >= star
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <input type="hidden" {...register('rating')} />
                    </FormField>

                    {/* Message */}
                    <FormField label="Message" htmlFor="message" error={errors.message?.message} required>
                      <GlassTextarea
                        id="message"
                        placeholder="Tell us about your experience..."
                        hasError={!!errors.message}
                        {...register('message')}
                      />
                    </FormField>

                    {/* Error Message */}
                    {submitError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {submitError}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      isDisabled={isSubmitting}
                      className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 font-semibold text-[15px] text-white rounded-xl shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
