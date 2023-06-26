import { is } from "date-fns/locale"
import { useState } from "react"


export default function VisibilityToggle({ 
  isPublic,
  onChange = () => {},
 }: {
  isPublic: boolean,
  onChange?: (isPublic: boolean) => void,
}) {
  const [isPublicState, setIsPublicState] = useState(isPublic)

  return (
    <fieldset>
      <legend className="sr-only">Visibility</legend>
      <div className="space-y-5">
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              checked={isPublicState}
              onChange={() => {
                setIsPublicState(true)
                onChange(true)
              }}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="comments" className="font-medium text-gray-900">
              Public
            </label>{' '}
            <span id="comments-description" className="text-gray-500">
              visibile to everyone.
            </span>
          </div>
        </div>
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="candidates"
              aria-describedby="candidates-description"
              name="candidates"
              type="checkbox"
              checked={!isPublicState}
              onChange={() => {
                setIsPublicState(false)
                onChange(false)
              }}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="candidates" className="font-medium text-gray-900">
              Private
            </label>{' '}
            <span id="candidates-description" className="text-gray-500">
              only visibile to me.
            </span>
          </div>
        </div>
      </div>
    </fieldset>
  )
}