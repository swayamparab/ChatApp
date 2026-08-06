"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff } from "lucide-react";

import {
    updateProfileSchema,
    UpdateProfileForm,
} from "@/schemas/profile";

import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { useProfileActions } from "@/hooks/user/useProfileActions";

type SettingsDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function SettingsDialog({
    open,
    onOpenChange,
}: SettingsDialogProps) {
    const { data } = useCurrentUser();

    const {
        updateProfile,
        isUpdatingProfile,
    } = useProfileActions();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const [showNewPassword, setShowNewPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isDirty,
        },
    } = useForm<UpdateProfileForm>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            username: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!data) return;

        reset({
            username: data.user.username,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    }, [data, reset, open]);

    function onSubmit(values: UpdateProfileForm) {
        if (!data) return;

        const payload: {
            username?: string;
            currentPassword?: string;
            newPassword?: string;
        } = {};

        if (values.username !== data.user.username) {
            payload.username = values.username;
        }

        if (values.newPassword) {
            payload.currentPassword =
                values.currentPassword;

            payload.newPassword =
                values.newPassword;
        }

        updateProfile(payload, {
            onSuccess: () => {
                reset({
                    username: values.username,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Settings
                    </DialogTitle>

                    <p className="text-sm text-slate-400">
                        Update your profile information.
                    </p>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <Label htmlFor="username">
                            Username
                        </Label>

                        <Input
                            id="username"
                            placeholder="Username"
                            autoComplete="username"
                            aria-invalid={!!errors.username}
                            {...register("username")}
                        />

                        {errors.username && (
                            <p className="text-sm text-red-500">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-slate-800 pt-5">
                        <h3 className="mb-4 font-medium text-white">
                            Security
                        </h3>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">
                                    Current Password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Current password"
                                        autoComplete="current-password"
                                        aria-invalid={!!errors.currentPassword}
                                        {...register("currentPassword")}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            )
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                            hover:text-white
                                        "
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {errors.currentPassword && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors
                                                .currentPassword
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">
                                    New Password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New password"
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.newPassword}
                                        {...register("newPassword")}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(!showNewPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {errors.newPassword && (
                                    <p className="text-sm text-red-500">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.confirmPassword}
                                        {...register("confirmPassword")}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={
                            isUpdatingProfile || !isDirty
                        }
                    >
                        {isUpdatingProfile
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}