import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { RxAvatar } from 'react-icons/rx'
import axios from 'axios'
import { server } from '../../../server'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [visiblePassword, setVisiblePassword] = useState(false)
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState(false)
  const [activationUrl, setActivationUrl] = useState("")

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) {
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!avatar) {
      toast.error("Please upload profile picture")
      return
    }

    setSubmitting(true)

    try {
      const newForm = new FormData()
      newForm.append("file", avatar)
      newForm.append("name", fullName)
      newForm.append("email", email)
      newForm.append("password", password)

      const res = await axios.post(
        `${server}/user/create-user`,
        newForm
      )

      if (res.data.success === true) {
        setCreated(true)
        setActivationUrl(res.data.activationUrl || "")

        // The backend answers 201 even when SMTP failed, so the "check your
        // email" toast would be a lie if emailSent is false.
        if (res.data.emailSent) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.message)
        }

        setFullName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setAvatar(null)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 sm:p-10 border border-gray-100">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join us today by filling in your details
            </p>
          </div>

          {/* Success panel: the activation mail is the part most likely to be
              filtered, so the confirmation (and, in development, the link
              itself) stays on screen instead of being replaced by a toast that
              disappears before it can be read. */}
          {created && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
              <h3 className="text-sm font-semibold text-green-900">
                Account created
              </h3>

              <p className="mt-2 text-sm text-green-800">
                We sent a verification email to the address you registered.
                Open the link in that email to verify your account. Check the
                spam folder if it has not arrived within a few minutes.
              </p>

              {activationUrl && (
                <a
                  href={activationUrl}
                  className="mt-4 inline-block rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-800"
                >
                  Verify account now (development only)
                </a>
              )}

              <Link
                to="/login"
                className="mt-4 block text-sm font-semibold text-green-900 underline"
              >
                Continue to sign in
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center border-4 border-indigo-100 shadow-md">
                    <RxAvatar className="text-5xl text-indigo-400" />
                  </div>
                )}
              </div>

              <label
                htmlFor="file-input"
                className="mt-4 inline-block cursor-pointer rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition"
              >
                Upload Profile Picture
              </label>

              <input
                type="file"
                name="avatar"
                id="file-input"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={visiblePassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-300"
                />

                {visiblePassword ? (
                  <AiOutlineEye
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    size={22}
                    onClick={() => setVisiblePassword(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    size={22}
                    onClick={() => setVisiblePassword(true)}
                  />
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={visibleConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-300"
                />

                {visibleConfirmPassword ? (
                  <AiOutlineEye
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    size={22}
                    onClick={() => setVisibleConfirmPassword(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    size={22}
                    onClick={() => setVisibleConfirmPassword(true)}
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating account..." : "Sign Up"}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
