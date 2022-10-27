import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import FormField from "~/components/shared/form-field";
import { getUser, login, register } from "~/utils/auth.server";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateText,
} from "~/utils/validators.server";

export const meta: MetaFunction = () => {
  return {
    title: `Derick's Personal Blog | Login`,
    description: `Login to Derick's Personal Blog`,
  };
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
  };
  fields?: {
    action: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest({
      formError: "Invalid form submission",
    });
  }
  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
    action: validateText(action),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({
      formError: "Invalid form submission",
    });

  switch (action) {
    case "login": {
      return await login({ email, password });
    }
    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ email, password, firstName, lastName });
    }
    default:
      return badRequest({ fieldErrors, formError: "Invalid Login" });
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const firstLoad = useRef(true);
  const [errors, setErrors] = useState(actionData?.fieldErrors || {});
  const [formError, setFormError] = useState(actionData?.fieldErrors || "");
  const [action, setAction] = useState("login");

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.firstName || "",
    lastName: actionData?.fields?.lastName || "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }));
  };
  useEffect(() => {
    // Clear the form if we switch forms
    if (!firstLoad.current) {
      const newState = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      };
      setErrors(newState);
      setFormError("");
      setFormData(newState);
    }
  }, [action]);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);

  useEffect(() => {
    // We don't want to reset errors on page load because we want to see them
    firstLoad.current = false;
  }, []);

  return (
    <>
      <div className="mx-auto p-2 md:w-1/4 md:p-4">
        <h2 className="pb-2 text-center text-xl font-semibold">
          Welcome to my Blog
        </h2>
        <p className="pb-2 text-center text-sm italic">
          {action === "login"
            ? "Please Login to leave a comment on a Post"
            : "Sign up to start commenting"}
        </p>
        <form method="post" className="form-primary">
          <div>{formError}</div>

          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(event) => handleInputChange(event, "email")}
            error={errors?.email}
          />
          <FormField
            htmlFor="password"
            label="Password"
            value={formData.password}
            type="password"
            onChange={(event) => handleInputChange(event, "password")}
            error={errors?.password}
            autocomplete="new-password"
          />
          {action === "register" && (
            <>
              {/* First Name */}
              <FormField
                htmlFor="firstName"
                label="First Name"
                onChange={(event) => handleInputChange(event, "firstName")}
                value={formData.firstName}
                error={errors?.firstName}
              />
              {/* Last Name */}
              <FormField
                htmlFor="lastName"
                label="Last name or last Initial"
                placeholder="Enter your last name or 1-3 letters to help identify you"
                onChange={(event) => handleInputChange(event, "lastName")}
                value={formData.lastName}
                error={errors?.lastName}
              />
            </>
          )}

          <div>
            <button
              className="w-full rounded-md bg-green-600 p-2 text-center uppercase text-white"
              type="submit"
              name="_action"
              value={action}
            >
              {action === "login" ? `Login` : `Sign Up`}
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col items-center p-2 md:p-4">
        <p className="font-semibold uppercase">or</p>
        <button
          onClick={() => setAction(action == "login" ? "register" : "login")}
          className="mt-3 rounded-md bg-green-600 p-2 text-center font-semibold uppercase text-white"
        >
          {action === "login" ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </>
  );
}
