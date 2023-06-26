
/**
 * Parses the delay from the tags
 * @param tags
 * @returns {delay: number | null, delayUnit: string | undefined | null}
 * All possible returned delay units are: seconds, minutes, hours, days
 * @example
 * const { delay, delayUnit } = parseDelayFromTags(['pc', '30min', '4hours'])
 * console.log(delay) // 30
 * console.log(delayUnit) // 'minutes'
*/
export default function parseDelayFromTags (tags: string[] | undefined): { delay: number | null, delayUnit: string | undefined | null } {
  // check if any of the tags contain the strings seconds sec s, minutes min m, hours hr h, days d
  // if so, parse the number and the unit
  if (!tags) return { delay: null, delayUnit: null }

  const delayTag = tags.find(tag => tag.match(/(seconds|sec|s|minutes|min|m|hours|hr|h|days|d)/))
  if (delayTag) {
    const delay = parseInt(delayTag.replace(/(seconds|sec|s|minutes|min|m|hours|hr|h|days|d)/, ''))
    const delayUnit = delayTag.match(/(seconds|sec|s|minutes|min|m|hours|hr|h|days|d)/)?.[0]

    // standardize the unit
    if (delayUnit === 'sec' || delayUnit === 's') {
      return { delay, delayUnit: 'seconds' }
    } else if (delayUnit === 'min' || delayUnit === 'm') {
      return { delay, delayUnit: 'minutes' }
    } else if (delayUnit === 'hr' || delayUnit === 'h') {
      return { delay, delayUnit: 'hours' }
    } else if (delayUnit === 'd') {
      return { delay, delayUnit: 'days' }
    } else {
      return { delay, delayUnit }
    }
  }

  return {
    delay: null,
    delayUnit: null
  }
}