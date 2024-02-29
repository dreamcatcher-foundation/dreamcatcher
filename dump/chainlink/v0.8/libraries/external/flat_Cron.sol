
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\libraries\external\Cron.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT

// sourced from https://github.com/pipermerriam/ethereum-datetime

pragma solidity ^0.8.0;

library DateTime {
  /*
   *  Date and Time utilities for ethereum contracts
   *
   */
  struct _DateTime {
    uint16 year;
    uint8 month;
    uint8 day;
    uint8 hour;
    uint8 minute;
    uint8 second;
    uint8 weekday;
  }

  uint256 constant DAY_IN_SECONDS = 86400;
  uint256 constant YEAR_IN_SECONDS = 31536000;
  uint256 constant LEAP_YEAR_IN_SECONDS = 31622400;

  uint256 constant HOUR_IN_SECONDS = 3600;
  uint256 constant MINUTE_IN_SECONDS = 60;

  uint16 constant ORIGIN_YEAR = 1970;

  function isLeapYear(uint16 year) internal pure returns (bool) {
    if (year % 4 != 0) {
      return false;
    }
    if (year % 100 != 0) {
      return true;
    }
    if (year % 400 != 0) {
      return false;
    }
    return true;
  }

  function leapYearsBefore(uint256 year) internal pure returns (uint256) {
    year -= 1;
    return year / 4 - year / 100 + year / 400;
  }

  function getDaysInMonth(uint8 month, uint16 year)
    internal
    pure
    returns (uint8)
  {
    if (
      month == 1 ||
      month == 3 ||
      month == 5 ||
      month == 7 ||
      month == 8 ||
      month == 10 ||
      month == 12
    ) {
      return 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      return 30;
    } else if (isLeapYear(year)) {
      return 29;
    } else {
      return 28;
    }
  }

  function parseTimestamp(uint256 timestamp)
    internal
    pure
    returns (_DateTime memory dt)
  {
    uint256 secondsAccountedFor = 0;
    uint256 buf;
    uint8 i;

    // Year
    dt.year = getYear(timestamp);
    buf = leapYearsBefore(dt.year) - leapYearsBefore(ORIGIN_YEAR);

    secondsAccountedFor += LEAP_YEAR_IN_SECONDS * buf;
    secondsAccountedFor += YEAR_IN_SECONDS * (dt.year - ORIGIN_YEAR - buf);

    // Month
    uint256 secondsInMonth;
    for (i = 1; i <= 12; i++) {
      secondsInMonth = DAY_IN_SECONDS * getDaysInMonth(i, dt.year);
      if (secondsInMonth + secondsAccountedFor > timestamp) {
        dt.month = i;
        break;
      }
      secondsAccountedFor += secondsInMonth;
    }

    // Day
    for (i = 1; i <= getDaysInMonth(dt.month, dt.year); i++) {
      if (DAY_IN_SECONDS + secondsAccountedFor > timestamp) {
        dt.day = i;
        break;
      }
      secondsAccountedFor += DAY_IN_SECONDS;
    }

    // Hour
    dt.hour = getHour(timestamp);

    // Minute
    dt.minute = getMinute(timestamp);

    // Second
    dt.second = getSecond(timestamp);

    // Day of week.
    dt.weekday = getWeekday(timestamp);
  }

  function getYear(uint256 timestamp) internal pure returns (uint16) {
    uint256 secondsAccountedFor = 0;
    uint16 year;
    uint256 numLeapYears;

    // Year
    year = uint16(ORIGIN_YEAR + timestamp / YEAR_IN_SECONDS);
    numLeapYears = leapYearsBefore(year) - leapYearsBefore(ORIGIN_YEAR);

    secondsAccountedFor += LEAP_YEAR_IN_SECONDS * numLeapYears;
    secondsAccountedFor +=
      YEAR_IN_SECONDS *
      (year - ORIGIN_YEAR - numLeapYears);

    while (secondsAccountedFor > timestamp) {
      if (isLeapYear(uint16(year - 1))) {
        secondsAccountedFor -= LEAP_YEAR_IN_SECONDS;
      } else {
        secondsAccountedFor -= YEAR_IN_SECONDS;
      }
      year -= 1;
    }
    return year;
  }

  function getMonth(uint256 timestamp) internal pure returns (uint8) {
    return parseTimestamp(timestamp).month;
  }

  function getDay(uint256 timestamp) internal pure returns (uint8) {
    return parseTimestamp(timestamp).day;
  }

  function getHour(uint256 timestamp) internal pure returns (uint8) {
    return uint8((timestamp / 60 / 60) % 24);
  }

  function getMinute(uint256 timestamp) internal pure returns (uint8) {
    return uint8((timestamp / 60) % 60);
  }

  function getSecond(uint256 timestamp) internal pure returns (uint8) {
    return uint8(timestamp % 60);
  }

  function getWeekday(uint256 timestamp) internal pure returns (uint8) {
    return uint8((timestamp / DAY_IN_SECONDS + 4) % 7);
  }

  function toTimestamp(
    uint16 year,
    uint8 month,
    uint8 day
  ) internal pure returns (uint256 timestamp) {
    return toTimestamp(year, month, day, 0, 0, 0);
  }

  function toTimestamp(
    uint16 year,
    uint8 month,
    uint8 day,
    uint8 hour
  ) internal pure returns (uint256 timestamp) {
    return toTimestamp(year, month, day, hour, 0, 0);
  }

  function toTimestamp(
    uint16 year,
    uint8 month,
    uint8 day,
    uint8 hour,
    uint8 minute
  ) internal pure returns (uint256 timestamp) {
    return toTimestamp(year, month, day, hour, minute, 0);
  }

  function toTimestamp(
    uint16 year,
    uint8 month,
    uint8 day,
    uint8 hour,
    uint8 minute,
    uint8 second
  ) internal pure returns (uint256 timestamp) {
    uint16 i;

    // Year
    for (i = ORIGIN_YEAR; i < year; i++) {
      if (isLeapYear(i)) {
        timestamp += LEAP_YEAR_IN_SECONDS;
      } else {
        timestamp += YEAR_IN_SECONDS;
      }
    }

    // Month
    uint8[12] memory monthDayCounts;
    monthDayCounts[0] = 31;
    if (isLeapYear(year)) {
      monthDayCounts[1] = 29;
    } else {
      monthDayCounts[1] = 28;
    }
    monthDayCounts[2] = 31;
    monthDayCounts[3] = 30;
    monthDayCounts[4] = 31;
    monthDayCounts[5] = 30;
    monthDayCounts[6] = 31;
    monthDayCounts[7] = 31;
    monthDayCounts[8] = 30;
    monthDayCounts[9] = 31;
    monthDayCounts[10] = 30;
    monthDayCounts[11] = 31;

    for (i = 1; i < month; i++) {
      timestamp += DAY_IN_SECONDS * monthDayCounts[i - 1];
    }

    // Day
    timestamp += DAY_IN_SECONDS * (day - 1);

    // Hour
    timestamp += HOUR_IN_SECONDS * (hour);

    // Minute
    timestamp += MINUTE_IN_SECONDS * (minute);

    // Second
    timestamp += second;

    return timestamp;
  }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\libraries\external\Cron.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: Apache 2.0

/*
 * @title String & slice utility library for Solidity contracts.
 * @author Nick Johnson <arachnid@notdot.net>
 *
 * @dev Functionality in this library is largely implemented using an
 *      abstraction called a 'slice'. A slice represents a part of a string -
 *      anything from the entire string to a single character, or even no
 *      characters at all (a 0-length slice). Since a slice only has to specify
 *      an offset and a length, copying and manipulating slices is a lot less
 *      expensive than copying and manipulating the strings they reference.
 *
 *      To further reduce gas costs, most functions on slice that need to return
 *      a slice modify the original one instead of allocating a new one; for
 *      instance, `s.split(".")` will return the text up to the first '.',
 *      modifying s to only contain the remainder of the string after the '.'.
 *      In situations where you do not want to modify the original slice, you
 *      can make a copy first with `.copy()`, for example:
 *      `s.copy().split(".")`. Try and avoid using this idiom in loops; since
 *      Solidity has no memory management, it will result in allocating many
 *      short-lived slices that are later discarded.
 *
 *      Functions that return two slices come in two versions: a non-allocating
 *      version that takes the second slice as an argument, modifying it in
 *      place, and an allocating version that allocates and returns the second
 *      slice; see `nextRune` for example.
 *
 *      Functions that have to copy string data will return strings rather than
 *      slices; these can be cast back to slices for further processing if
 *      required.
 *
 *      For convenience, some functions are provided with non-modifying
 *      variants that create a new slice and return both; for instance,
 *      `s.splitNew('.')` leaves s unmodified, and returns two values
 *      corresponding to the left and right parts of the string.
 */

pragma solidity ^0.8.0;

library strings {
  struct slice {
    uint256 _len;
    uint256 _ptr;
  }

  function memcpy(
    uint256 dest,
    uint256 src,
    uint256 len
  ) private pure {
    // Copy word-length chunks while possible
    for (; len >= 32; len -= 32) {
      assembly {
        mstore(dest, mload(src))
      }
      dest += 32;
      src += 32;
    }

    // Copy remaining bytes
    uint256 mask = type(uint256).max;
    if (len > 0) {
      mask = 256**(32 - len) - 1;
    }
    assembly {
      let srcpart := and(mload(src), not(mask))
      let destpart := and(mload(dest), mask)
      mstore(dest, or(destpart, srcpart))
    }
  }

  /*
   * @dev Returns a slice containing the entire string.
   * @param self The string to make a slice from.
   * @return A newly allocated slice containing the entire string.
   */
  function toSlice(string memory self) internal pure returns (slice memory) {
    uint256 ptr;
    assembly {
      ptr := add(self, 0x20)
    }
    return slice(bytes(self).length, ptr);
  }

  /*
   * @dev Returns the length of a null-terminated bytes32 string.
   * @param self The value to find the length of.
   * @return The length of the string, from 0 to 32.
   */
  function len(bytes32 self) internal pure returns (uint256) {
    uint256 ret;
    if (self == 0) return 0;
    if (uint256(self) & type(uint128).max == 0) {
      ret += 16;
      self = bytes32(uint256(self) / 0x100000000000000000000000000000000);
    }
    if (uint256(self) & type(uint64).max == 0) {
      ret += 8;
      self = bytes32(uint256(self) / 0x10000000000000000);
    }
    if (uint256(self) & type(uint32).max == 0) {
      ret += 4;
      self = bytes32(uint256(self) / 0x100000000);
    }
    if (uint256(self) & type(uint16).max == 0) {
      ret += 2;
      self = bytes32(uint256(self) / 0x10000);
    }
    if (uint256(self) & type(uint8).max == 0) {
      ret += 1;
    }
    return 32 - ret;
  }

  /*
   * @dev Returns a slice containing the entire bytes32, interpreted as a
   *      null-terminated utf-8 string.
   * @param self The bytes32 value to convert to a slice.
   * @return A new slice containing the value of the input argument up to the
   *         first null.
   */
  function toSliceB32(bytes32 self) internal pure returns (slice memory ret) {
    // Allocate space for `self` in memory, copy it there, and point ret at it
    assembly {
      let ptr := mload(0x40)
      mstore(0x40, add(ptr, 0x20))
      mstore(ptr, self)
      mstore(add(ret, 0x20), ptr)
    }
    ret._len = len(self);
  }

  /*
   * @dev Returns a new slice containing the same data as the current slice.
   * @param self The slice to copy.
   * @return A new slice containing the same data as `self`.
   */
  function copy(slice memory self) internal pure returns (slice memory) {
    return slice(self._len, self._ptr);
  }

  /*
   * @dev Copies a slice to a new string.
   * @param self The slice to copy.
   * @return A newly allocated string containing the slice's text.
   */
  function toString(slice memory self) internal pure returns (string memory) {
    string memory ret = new string(self._len);
    uint256 retptr;
    assembly {
      retptr := add(ret, 32)
    }

    memcpy(retptr, self._ptr, self._len);
    return ret;
  }

  /*
   * @dev Returns the length in runes of the slice. Note that this operation
   *      takes time proportional to the length of the slice; avoid using it
   *      in loops, and call `slice.empty()` if you only need to know whether
   *      the slice is empty or not.
   * @param self The slice to operate on.
   * @return The length of the slice in runes.
   */
  function len(slice memory self) internal pure returns (uint256 l) {
    // Starting at ptr-31 means the LSB will be the byte we care about
    uint256 ptr = self._ptr - 31;
    uint256 end = ptr + self._len;
    for (l = 0; ptr < end; l++) {
      uint8 b;
      assembly {
        b := and(mload(ptr), 0xFF)
      }
      if (b < 0x80) {
        ptr += 1;
      } else if (b < 0xE0) {
        ptr += 2;
      } else if (b < 0xF0) {
        ptr += 3;
      } else if (b < 0xF8) {
        ptr += 4;
      } else if (b < 0xFC) {
        ptr += 5;
      } else {
        ptr += 6;
      }
    }
  }

  /*
   * @dev Returns true if the slice is empty (has a length of 0).
   * @param self The slice to operate on.
   * @return True if the slice is empty, False otherwise.
   */
  function empty(slice memory self) internal pure returns (bool) {
    return self._len == 0;
  }

  /*
   * @dev Returns a positive number if `other` comes lexicographically after
   *      `self`, a negative number if it comes before, or zero if the
   *      contents of the two slices are equal. Comparison is done per-rune,
   *      on unicode codepoints.
   * @param self The first slice to compare.
   * @param other The second slice to compare.
   * @return The result of the comparison.
   */
  function compare(slice memory self, slice memory other)
    internal
    pure
    returns (int256)
  {
    uint256 shortest = self._len;
    if (other._len < self._len) shortest = other._len;

    uint256 selfptr = self._ptr;
    uint256 otherptr = other._ptr;
    for (uint256 idx = 0; idx < shortest; idx += 32) {
      uint256 a;
      uint256 b;
      assembly {
        a := mload(selfptr)
        b := mload(otherptr)
      }
      if (a != b) {
        // Mask out irrelevant bytes and check again
        uint256 mask = type(uint256).max; // 0xffff...
        if (shortest < 32) {
          mask = ~(2**(8 * (32 - shortest + idx)) - 1);
        }
        unchecked {
          uint256 diff = (a & mask) - (b & mask);
          if (diff != 0) return int256(diff);
        }
      }
      selfptr += 32;
      otherptr += 32;
    }
    return int256(self._len) - int256(other._len);
  }

  /*
   * @dev Returns true if the two slices contain the same text.
   * @param self The first slice to compare.
   * @param self The second slice to compare.
   * @return True if the slices are equal, false otherwise.
   */
  function equals(slice memory self, slice memory other)
    internal
    pure
    returns (bool)
  {
    return compare(self, other) == 0;
  }

  /*
   * @dev Extracts the first rune in the slice into `rune`, advancing the
   *      slice to point to the next rune and returning `self`.
   * @param self The slice to operate on.
   * @param rune The slice that will contain the first rune.
   * @return `rune`.
   */
  function nextRune(slice memory self, slice memory rune)
    internal
    pure
    returns (slice memory)
  {
    rune._ptr = self._ptr;

    if (self._len == 0) {
      rune._len = 0;
      return rune;
    }

    uint256 l;
    uint256 b;
    // Load the first byte of the rune into the LSBs of b
    assembly {
      b := and(mload(sub(mload(add(self, 32)), 31)), 0xFF)
    }
    if (b < 0x80) {
      l = 1;
    } else if (b < 0xE0) {
      l = 2;
    } else if (b < 0xF0) {
      l = 3;
    } else {
      l = 4;
    }

    // Check for truncated codepoints
    if (l > self._len) {
      rune._len = self._len;
      self._ptr += self._len;
      self._len = 0;
      return rune;
    }

    self._ptr += l;
    self._len -= l;
    rune._len = l;
    return rune;
  }

  /*
   * @dev Returns the first rune in the slice, advancing the slice to point
   *      to the next rune.
   * @param self The slice to operate on.
   * @return A slice containing only the first rune from `self`.
   */
  function nextRune(slice memory self)
    internal
    pure
    returns (slice memory ret)
  {
    nextRune(self, ret);
  }

  /*
   * @dev Returns the number of the first codepoint in the slice.
   * @param self The slice to operate on.
   * @return The number of the first codepoint in the slice.
   */
  function ord(slice memory self) internal pure returns (uint256 ret) {
    if (self._len == 0) {
      return 0;
    }

    uint256 word;
    uint256 length;
    uint256 divisor = 2**248;

    // Load the rune into the MSBs of b
    assembly {
      word := mload(mload(add(self, 32)))
    }
    uint256 b = word / divisor;
    if (b < 0x80) {
      ret = b;
      length = 1;
    } else if (b < 0xE0) {
      ret = b & 0x1F;
      length = 2;
    } else if (b < 0xF0) {
      ret = b & 0x0F;
      length = 3;
    } else {
      ret = b & 0x07;
      length = 4;
    }

    // Check for truncated codepoints
    if (length > self._len) {
      return 0;
    }

    for (uint256 i = 1; i < length; i++) {
      divisor = divisor / 256;
      b = (word / divisor) & 0xFF;
      if (b & 0xC0 != 0x80) {
        // Invalid UTF-8 sequence
        return 0;
      }
      ret = (ret * 64) | (b & 0x3F);
    }

    return ret;
  }

  /*
   * @dev Returns the keccak-256 hash of the slice.
   * @param self The slice to hash.
   * @return The hash of the slice.
   */
  function keccak(slice memory self) internal pure returns (bytes32 ret) {
    assembly {
      ret := keccak256(mload(add(self, 32)), mload(self))
    }
  }

  /*
   * @dev Returns true if `self` starts with `needle`.
   * @param self The slice to operate on.
   * @param needle The slice to search for.
   * @return True if the slice starts with the provided text, false otherwise.
   */
  function startsWith(slice memory self, slice memory needle)
    internal
    pure
    returns (bool)
  {
    if (self._len < needle._len) {
      return false;
    }

    if (self._ptr == needle._ptr) {
      return true;
    }

    bool equal;
    assembly {
      let length := mload(needle)
      let selfptr := mload(add(self, 0x20))
      let needleptr := mload(add(needle, 0x20))
      equal := eq(keccak256(selfptr, length), keccak256(needleptr, length))
    }
    return equal;
  }

  /*
   * @dev If `self` starts with `needle`, `needle` is removed from the
   *      beginning of `self`. Otherwise, `self` is unmodified.
   * @param self The slice to operate on.
   * @param needle The slice to search for.
   * @return `self`
   */
  function beyond(slice memory self, slice memory needle)
    internal
    pure
    returns (slice memory)
  {
    if (self._len < needle._len) {
      return self;
    }

    bool equal = true;
    if (self._ptr != needle._ptr) {
      assembly {
        let length := mload(needle)
        let selfptr := mload(add(self, 0x20))
        let needleptr := mload(add(needle, 0x20))
        equal := eq(keccak256(selfptr, length), keccak256(needleptr, length))
      }
    }

    if (equal) {
      self._len -= needle._len;
      self._ptr += needle._len;
    }

    return self;
  }

  /*
   * @dev Returns true if the slice ends with `needle`.
   * @param self The slice to operate on.
   * @param needle The slice to search for.
   * @return True if the slice starts with the provided text, false otherwise.
   */
  function endsWith(slice memory self, slice memory needle)
    internal
    pure
    returns (bool)
  {
    if (self._len < needle._len) {
      return false;
    }

    uint256 selfptr = self._ptr + self._len - needle._len;

    if (selfptr == needle._ptr) {
      return true;
    }

    bool equal;
    assembly {
      let length := mload(needle)
      let needleptr := mload(add(needle, 0x20))
      equal := eq(keccak256(selfptr, length), keccak256(needleptr, length))
    }

    return equal;
  }

  /*
   * @dev If `self` ends with `needle`, `needle` is removed from the
   *      end of `self`. Otherwise, `self` is unmodified.
   * @param self The slice to operate on.
   * @param needle The slice to search for.
   * @return `self`
   */
  function until(slice memory self, slice memory needle)
    internal
    pure
    returns (slice memory)
  {
    if (self._len < needle._len) {
      return self;
    }

    uint256 selfptr = self._ptr + self._len - needle._len;
    bool equal = true;
    if (selfptr != needle._ptr) {
      assembly {
        let length := mload(needle)
        let needleptr := mload(add(needle, 0x20))
        equal := eq(keccak256(selfptr, length), keccak256(needleptr, length))
      }
    }

    if (equal) {
      self._len -= needle._len;
    }

    return self;
  }

  // Returns the memory address of the first byte of the first occurrence of
  // `needle` in `self`, or the first byte after `self` if not found.
  function findPtr(
    uint256 selflen,
    uint256 selfptr,
    uint256 needlelen,
    uint256 needleptr
  ) private pure returns (uint256) {
    uint256 ptr = selfptr;
    uint256 idx;

    if (needlelen <= selflen) {
      if (needlelen <= 32) {
        bytes32 mask;
        if (needlelen > 0) {
          mask = bytes32(~(2**(8 * (32 - needlelen)) - 1));
        }

        bytes32 needledata;
        assembly {
          needledata := and(mload(needleptr), mask)
        }

        uint256 end = selfptr + selflen - needlelen;
        bytes32 ptrdata;
        assembly {
          ptrdata := and(mload(ptr), mask)
        }

        while (ptrdata != needledata) {
          if (ptr >= end) return selfptr + selflen;
          ptr++;
          assembly {
            ptrdata := and(mload(ptr), mask)
          }
        }
        return ptr;
      } else {
        // For long needles, use hashing
        bytes32 hash;
        assembly {
          hash := keccak256(needleptr, needlelen)
        }

        for (idx = 0; idx <= selflen - needlelen; idx++) {
          bytes32 testHash;
          assembly {
            testHash := keccak256(ptr, needlelen)
          }
          if (hash == testHash) return ptr;
          ptr += 1;
        }
      }
    }
    return selfptr + selflen;
  }

  // Returns the memory address of the first byte after the last occurrence of
  // `needle` in `self`, or the address of `self` if not found.
  function rfindPtr(
    uint256 selflen,
    uint256 selfptr,
    uint256 needlelen,
    uint256 needleptr
  ) private pure returns (uint256) {
    uint256 ptr;

    if (needlelen <= selflen) {
      if (needlelen <= 32) {
        bytes32 mask;
        if (needlelen > 0) {
          mask = bytes32(~(2**(8 * (32 - needlelen)) - 1));
        }

        bytes32 needledata;
        assembly {
          needledata := and(mload(needleptr), mask)
        }

        ptr = selfptr + selflen - needlelen;
        bytes32 ptrdata;
        assembly {
          ptrdata := and(mload(ptr), mask)
        }

        while (ptrdata != needledata) {
          if (ptr <= selfptr) return selfptr;
          ptr--;
          assembly {
            ptrdata := and(mload(ptr), mask)
          }
        }
        return ptr + needlelen;
      } else {
        // For long needles, use hashing
        bytes32 hash;
        assembly {
          hash := keccak256(needleptr, needlelen)
        }
        ptr = selfptr + (selflen - needlelen);
        while (ptr >= selfptr) {
          bytes32 testHash;
          assembly {
            testHash := keccak256(ptr, needlelen)
          }
          if (hash == testHash) return ptr + needlelen;
          ptr -= 1;
        }
      }
    }
    return selfptr;
  }

  /*
   * @dev Modifies `self` to contain everything from the first occurrence of
   *      `needle` to the end of the slice. `self` is set to the empty slice
   *      if `needle` is not found.
   * @param self The slice to search and modify.
   * @param needle The text to search for.
   * @return `self`.
   */
  function find(slice memory self, slice memory needle)
    internal
    pure
    returns (slice memory)
  {
    uint256 ptr = findPtr(self._len, self._ptr, needle._len, needle._ptr);
    self._len -= ptr - self._ptr;
    self._ptr = ptr;
    return self;
  }

  /*
   * @dev Modifies `self` to contain the part of the string from the start of
   *      `self` to the end of the first occurrence of `needle`. If `needle`
   *      is not found, `self` is set to the empty slice.
   * @param self The slice to search and modify.
   * @param needle The text to search for.
   * @return `self`.
   */
  function rfind(slice memory self, slice memory needle)
    internal
    pure
    returns (slice memory)
  {
    uint256 ptr = rfindPtr(self._len, self._ptr, needle._len, needle._ptr);
    self._len = ptr - self._ptr;
    return self;
  }

  /*
   * @dev Splits the slice, setting `self` to everything after the first
   *      occurrence of `needle`, and `token` to everything before it. If
   *      `needle` does not occur in `self`, `self` is set to the empty slice,
   *      and `token` is set to the entirety of `self`.
   * @param self The slice to split.
   * @param needle The text to search for in `self`.
   * @param token An output parameter to which the first token is written.
   * @return `token`.
   */
  function split(
    slice memory self,
    slice memory needle,
    slice memory token
  ) internal pure returns (slice memory) {
    uint256 ptr = findPtr(self._len, self._ptr, needle._len, needle._ptr);
    token._ptr = self._ptr;
    token._len = ptr - self._ptr;
    if (ptr == self._ptr + self._len) {
      // Not found
      self._len = 0;
    } else {
      self._len -= token._len + needle._len;
      self._ptr = ptr + needle._len;
    }
    return token;
  }

  /*
   * @dev Splits the slice, setting `self` to everything after the first
   *      occurrence of `needle`, and returning everything before it. If
   *      `needle` does not occur in `self`, `self` is set to the empty slice,
   *      and the entirety of `self` is returned.
   * @param self The slice to split.
   * @param needle The text to search for in `self`.
   * @return The part of `self` up to the first occurrence of `delim`.
   */
  function split(slice memory self, slice memory needle)
    internal
    pure
    returns (slice memory token)
  {
    split(self, needle, token);
  }

  /*
   * @dev Splits the slice, setting `self` to everything before the last
   *      occurrence of `needle`, and `token` to everything after it. If
   *      `needle` does not occur in `self`, `self` is set to the empty slice,
   *      and `token` is set to the entirety of `self`.
   * @param self The slice to split.
   * @param needle The text to search for in `self`.
   * @param token An output parameter to which the first token is written.
   * @return `token`.
   */
  function rsplit(
    slice memory self,
    slice memory needle,
    slice memory token
  ) internal pure returns (slice memory) {
    uint256 ptr = rfindPtr(self._len, self._ptr, needle._len, needle._ptr);
    token._ptr = ptr;
    token._len = self._len - (ptr - self._ptr);
    if (ptr == self._ptr) {
      // Not found
      self._len = 0;
    } else {
      self._len -= token._len + needle._len;
    }
    return token;
  }

  /*
   * @dev Splits the slice, setting `self` to everything before the last
   *      occurrence of `needle`, and returning everything after it. If
   *      `needle` does not occur in `self`, `self` is set to the empty slice,
   *      and the entirety of `self` is returned.
   * @param self The slice to split.
   * @param needle The text to search for in `self`.
   * @return The part of `self` after the last occurrence of `delim`.
   */
  function rsplit(slice memory self, slice memory needle)
    internal
    pure
    returns (slice memory token)
  {
    rsplit(self, needle, token);
  }

  /*
   * @dev Counts the number of nonoverlapping occurrences of `needle` in `self`.
   * @param self The slice to search.
   * @param needle The text to search for in `self`.
   * @return The number of occurrences of `needle` found in `self`.
   */
  function count(slice memory self, slice memory needle)
    internal
    pure
    returns (uint256 cnt)
  {
    uint256 ptr = findPtr(self._len, self._ptr, needle._len, needle._ptr) +
      needle._len;
    while (ptr <= self._ptr + self._len) {
      cnt++;
      ptr =
        findPtr(self._len - (ptr - self._ptr), ptr, needle._len, needle._ptr) +
        needle._len;
    }
  }

  /*
   * @dev Returns True if `self` contains `needle`.
   * @param self The slice to search.
   * @param needle The text to search for in `self`.
   * @return True if `needle` is found in `self`, false otherwise.
   */
  function contains(slice memory self, slice memory needle)
    internal
    pure
    returns (bool)
  {
    return
      rfindPtr(self._len, self._ptr, needle._len, needle._ptr) != self._ptr;
  }

  /*
   * @dev Returns a newly allocated string containing the concatenation of
   *      `self` and `other`.
   * @param self The first slice to concatenate.
   * @param other The second slice to concatenate.
   * @return The concatenation of the two strings.
   */
  function concat(slice memory self, slice memory other)
    internal
    pure
    returns (string memory)
  {
    string memory ret = new string(self._len + other._len);
    uint256 retptr;
    assembly {
      retptr := add(ret, 32)
    }
    memcpy(retptr, self._ptr, self._len);
    memcpy(retptr + self._len, other._ptr, other._len);
    return ret;
  }

  /*
   * @dev Joins an array of slices, using `self` as a delimiter, returning a
   *      newly allocated string.
   * @param self The delimiter to use.
   * @param parts A list of slices to join.
   * @return A newly allocated string containing all the slices in `parts`,
   *         joined with `self`.
   */
  function join(slice memory self, slice[] memory parts)
    internal
    pure
    returns (string memory)
  {
    if (parts.length == 0) return "";

    uint256 length = self._len * (parts.length - 1);
    for (uint256 i = 0; i < parts.length; i++) length += parts[i]._len;

    string memory ret = new string(length);
    uint256 retptr;
    assembly {
      retptr := add(ret, 32)
    }

    for (uint256 i = 0; i < parts.length; i++) {
      memcpy(retptr, parts[i]._ptr, parts[i]._len);
      retptr += parts[i]._len;
      if (i < parts.length - 1) {
        memcpy(retptr, self._ptr, self._len);
        retptr += self._len;
      }
    }

    return ret;
  }
}




/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\libraries\external\Cron.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT

/*
  The Cron contract serves two primary functions:
    * parsing cron-formatted strings like "0 0 * * *" into
      structs called "Specs"
    * computing the "next tick" of a cron spec

  Because manipulating strings is gas-expensive in solidity,
  the intended use of this contract is for users to first convert
  their cron strings to encoded Spec structs via toEncodedSpec().
  Then, the user stores the Spec on chain. Finally, users use the nextTick(),
  function to determine the datetime of the next cron job run.

  Cron jobs are interpreted according to this format:

  ┌───────────── minute (0 - 59)
  │ ┌───────────── hour (0 - 23)
  │ │ ┌───────────── day of the month (1 - 31)
  │ │ │ ┌───────────── month (1 - 12)
  │ │ │ │ ┌───────────── day of the week (0 - 6) (Monday to Sunday)
  │ │ │ │ │
  │ │ │ │ │
  │ │ │ │ │
  * * * * *

  Special limitations:
    * there is no year field
    * no special characters: ? L W #
    * lists can have a max length of 26
    * no words like JAN / FEB or MON / TUES
*/

pragma solidity 0.8.6;

////import "../../vendor/Strings.sol";
////import "../../vendor/DateTime.sol";

// The fields of a cron spec, by name
string constant MINUTE = "minute";
string constant HOUR = "hour";
string constant DAY = "day";
string constant MONTH = "month";
string constant DAY_OF_WEEK = "day of week";

error UnknownFieldType();
error InvalidSpec(string reason);
error InvalidField(string field, string reason);
error ListTooLarge();

// Set of enums representing a cron field type
enum FieldType {
  WILD,
  EXACT,
  INTERVAL,
  RANGE,
  LIST
}

// A spec represents a cron job by decomposing it into 5 fields
struct Spec {
  Field minute;
  Field hour;
  Field day;
  Field month;
  Field dayOfWeek;
}

// A field represents a single element in a cron spec. There are 5 types
// of fields (see above). Not all properties of this struct are present at once.
struct Field {
  FieldType fieldType;
  uint8 singleValue;
  uint8 interval;
  uint8 rangeStart;
  uint8 rangeEnd;
  uint8 listLength;
  uint8[26] list;
}

/**
 * @title The Cron library
 * @notice A utility contract for encoding/decoding cron strings (ex: 0 0 * * *) into an
 * abstraction called a Spec. The library also includes a spec function, nextTick(), which
 * determines the next time a cron job should fire based on the current block timestamp.
 */
library Cron {
  using strings for *;

  /**
   * @notice nextTick calculates the next datetime that a spec "ticks", starting
   * from the current block timestamp. This is gas-intensive and therefore should
   * only be called off-chain.
   * @param spec the spec to evaluate
   * @return the next tick
   * @dev this is the internal version of the library. There is also an external version.
   */
  function nextTick(Spec memory spec) internal view returns (uint256) {
    uint16 year = DateTime.getYear(block.timestamp);
    uint8 month = DateTime.getMonth(block.timestamp);
    uint8 day = DateTime.getDay(block.timestamp);
    uint8 hour = DateTime.getHour(block.timestamp);
    uint8 minute = DateTime.getMinute(block.timestamp);
    uint8 dayOfWeek;
    for (; true; year++) {
      for (; month <= 12; month++) {
        if (!matches(spec.month, month)) {
          day = 1;
          hour = 0;
          minute = 0;
          continue;
        }
        uint8 maxDay = DateTime.getDaysInMonth(month, year);
        for (; day <= maxDay; day++) {
          if (!matches(spec.day, day)) {
            hour = 0;
            minute = 0;
            continue;
          }
          dayOfWeek = DateTime.getWeekday(DateTime.toTimestamp(year, month, day));
          if (!matches(spec.dayOfWeek, dayOfWeek)) {
            hour = 0;
            minute = 0;
            continue;
          }
          for (; hour < 24; hour++) {
            if (!matches(spec.hour, hour)) {
              minute = 0;
              continue;
            }
            for (; minute < 60; minute++) {
              if (!matches(spec.minute, minute)) {
                continue;
              }
              return DateTime.toTimestamp(year, month, day, hour, minute);
            }
            minute = 0;
          }
          hour = 0;
        }
        day = 1;
      }
      month = 1;
    }
  }

  /**
   * @notice lastTick calculates the previous datetime that a spec "ticks", starting
   * from the current block timestamp. This is gas-intensive and therefore should
   * only be called off-chain.
   * @param spec the spec to evaluate
   * @return the next tick
   */
  function lastTick(Spec memory spec) internal view returns (uint256) {
    uint16 year = DateTime.getYear(block.timestamp);
    uint8 month = DateTime.getMonth(block.timestamp);
    uint8 day = DateTime.getDay(block.timestamp);
    uint8 hour = DateTime.getHour(block.timestamp);
    uint8 minute = DateTime.getMinute(block.timestamp);
    uint8 dayOfWeek;
    bool resetDay;
    for (; true; year--) {
      for (; month > 0; month--) {
        if (!matches(spec.month, month)) {
          resetDay = true;
          hour = 23;
          minute = 59;
          continue;
        }
        if (resetDay) {
          day = DateTime.getDaysInMonth(month, year);
        }
        for (; day > 0; day--) {
          if (!matches(spec.day, day)) {
            hour = 23;
            minute = 59;
            continue;
          }
          dayOfWeek = DateTime.getWeekday(DateTime.toTimestamp(year, month, day));
          if (!matches(spec.dayOfWeek, dayOfWeek)) {
            hour = 23;
            minute = 59;
            continue;
          }
          for (; hour >= 0; hour--) {
            if (!matches(spec.hour, hour)) {
              minute = 59;
              if (hour == 0) {
                break;
              }
              continue;
            }
            for (; minute >= 0; minute--) {
              if (!matches(spec.minute, minute)) {
                if (minute == 0) {
                  break;
                }
                continue;
              }
              return DateTime.toTimestamp(year, month, day, hour, minute);
            }
            minute = 59;
            if (hour == 0) {
              break;
            }
          }
          hour = 23;
        }
        resetDay = true;
      }
      month = 12;
    }
  }

  /**
   * @notice matches evaluates whether or not a spec "ticks" at a given timestamp
   * @param spec the spec to evaluate
   * @param timestamp the timestamp to compare against
   * @return true / false if they match
   */
  function matches(Spec memory spec, uint256 timestamp) internal view returns (bool) {
    DateTime._DateTime memory dt = DateTime.parseTimestamp(timestamp);
    return
      matches(spec.month, dt.month) &&
      matches(spec.day, dt.day) &&
      matches(spec.hour, dt.hour) &&
      matches(spec.minute, dt.minute);
  }

  /**
   * @notice toSpec converts a cron string to a spec struct. This is gas-intensive
   * and therefore should only be called off-chain.
   * @param cronString the cron string
   * @return the spec struct
   */
  function toSpec(string memory cronString) internal pure returns (Spec memory) {
    strings.slice memory space = strings.toSlice(" ");
    strings.slice memory cronSlice = strings.toSlice(cronString);
    if (cronSlice.count(space) != 4) {
      revert InvalidSpec("4 spaces required");
    }
    strings.slice memory minuteSlice = cronSlice.split(space);
    strings.slice memory hourSlice = cronSlice.split(space);
    strings.slice memory daySlice = cronSlice.split(space);
    strings.slice memory monthSlice = cronSlice.split(space);
    // DEV: dayOfWeekSlice = cronSlice
    // The cronSlice now contains the last section of the cron job,
    // which corresponds to the day of week
    if (
      minuteSlice.len() == 0 ||
      hourSlice.len() == 0 ||
      daySlice.len() == 0 ||
      monthSlice.len() == 0 ||
      cronSlice.len() == 0
    ) {
      revert InvalidSpec("some fields missing");
    }
    return
      validate(
        Spec({
          minute: sliceToField(minuteSlice),
          hour: sliceToField(hourSlice),
          day: sliceToField(daySlice),
          month: sliceToField(monthSlice),
          dayOfWeek: sliceToField(cronSlice)
        })
      );
  }

  /**
   * @notice toEncodedSpec converts a cron string to an abi-encoded spec. This is gas-intensive
   * and therefore should only be called off-chain.
   * @param cronString the cron string
   * @return the abi-encoded spec
   */
  function toEncodedSpec(string memory cronString) internal pure returns (bytes memory) {
    return abi.encode(toSpec(cronString));
  }

  /**
   * @notice toCronString converts a cron spec to a human-readable cron string. This is gas-intensive
   * and therefore should only be called off-chain.
   * @param spec the cron spec
   * @return the corresponding cron string
   */
  function toCronString(Spec memory spec) internal pure returns (string memory) {
    return
      string(
        bytes.concat(
          fieldToBstring(spec.minute),
          " ",
          fieldToBstring(spec.hour),
          " ",
          fieldToBstring(spec.day),
          " ",
          fieldToBstring(spec.month),
          " ",
          fieldToBstring(spec.dayOfWeek)
        )
      );
  }

  /**
   * @notice matches evaluates if a values matches a field.
   * ex: 3 matches *, 3 matches 0-5, 3 does not match 0,2,4
   * @param field the field struct to match against
   * @param value the value of a field
   * @return true / false if they match
   */
  function matches(Field memory field, uint8 value) private pure returns (bool) {
    if (field.fieldType == FieldType.WILD) {
      return true;
    } else if (field.fieldType == FieldType.INTERVAL) {
      return value % field.interval == 0;
    } else if (field.fieldType == FieldType.EXACT) {
      return value == field.singleValue;
    } else if (field.fieldType == FieldType.RANGE) {
      return value >= field.rangeStart && value <= field.rangeEnd;
    } else if (field.fieldType == FieldType.LIST) {
      for (uint256 idx = 0; idx < field.listLength; idx++) {
        if (value == field.list[idx]) {
          return true;
        }
      }
      return false;
    }
    revert UnknownFieldType();
  }

  // VALIDATIONS

  /**
   * @notice validate validates a spec, reverting if any errors are found
   * @param spec the spec to validate
   * @return the original spec
   */
  function validate(Spec memory spec) private pure returns (Spec memory) {
    validateField(spec.dayOfWeek, DAY_OF_WEEK, 0, 6);
    validateField(spec.month, MONTH, 1, 12);
    uint8 maxDay = maxDayForMonthField(spec.month);
    validateField(spec.day, DAY, 1, maxDay);
    validateField(spec.hour, HOUR, 0, 23);
    validateField(spec.minute, MINUTE, 0, 59);
    return spec;
  }

  /**
   * @notice validateField validates the value of a field. It reverts if an error is found.
   * @param field the field to validate
   * @param fieldName the name of the field ex "minute" or "hour"
   * @param min the minimum value a field can have (usually 1 or 0)
   * @param max the maximum value a field can have (ex minute = 59, hour = 23)
   */
  function validateField(
    Field memory field,
    string memory fieldName,
    uint8 min,
    uint8 max
  ) private pure {
    if (field.fieldType == FieldType.WILD) {
      return;
    } else if (field.fieldType == FieldType.EXACT) {
      if (field.singleValue < min || field.singleValue > max) {
        string memory reason = string(
          bytes.concat("value must be >=,", uintToBString(min), " and <=", uintToBString(max))
        );
        revert InvalidField(fieldName, reason);
      }
    } else if (field.fieldType == FieldType.INTERVAL) {
      if (field.interval < 1 || field.interval > max) {
        string memory reason = string(
          bytes.concat("inverval must be */(", uintToBString(1), "-", uintToBString(max), ")")
        );
        revert InvalidField(fieldName, reason);
      }
    } else if (field.fieldType == FieldType.RANGE) {
      if (field.rangeEnd > max || field.rangeEnd <= field.rangeStart) {
        string memory reason = string(
          bytes.concat("inverval must be within ", uintToBString(min), "-", uintToBString(max))
        );
        revert InvalidField(fieldName, reason);
      }
    } else if (field.fieldType == FieldType.LIST) {
      if (field.listLength < 2) {
        revert InvalidField(fieldName, "lists must have at least 2 items");
      }
      string memory reason = string(
        bytes.concat("items in list must be within ", uintToBString(min), "-", uintToBString(max))
      );
      uint8 listItem;
      for (uint256 idx = 0; idx < field.listLength; idx++) {
        listItem = field.list[idx];
        if (listItem < min || listItem > max) {
          revert InvalidField(fieldName, reason);
        }
      }
    } else {
      revert UnknownFieldType();
    }
  }

  /**
   * @notice maxDayForMonthField returns the maximum valid day given the month field
   * @param month the month field
   * @return the max day
   */
  function maxDayForMonthField(Field memory month) private pure returns (uint8) {
    // DEV: ranges are always safe because any two consecutive months will always
    // contain a month with 31 days
    if (month.fieldType == FieldType.WILD || month.fieldType == FieldType.RANGE) {
      return 31;
    } else if (month.fieldType == FieldType.EXACT) {
      // DEV: assume leap year in order to get max value
      return DateTime.getDaysInMonth(month.singleValue, 4);
    } else if (month.fieldType == FieldType.INTERVAL) {
      if (month.interval == 9 || month.interval == 11) {
        return 30;
      } else {
        return 31;
      }
    } else if (month.fieldType == FieldType.LIST) {
      uint8 result;
      for (uint256 idx = 0; idx < month.listLength; idx++) {
        // DEV: assume leap year in order to get max value
        uint8 daysInMonth = DateTime.getDaysInMonth(month.list[idx], 4);
        if (daysInMonth == 31) {
          return daysInMonth;
        }
        if (daysInMonth > result) {
          result = daysInMonth;
        }
      }
      return result;
    } else {
      revert UnknownFieldType();
    }
  }

  /**
   * @notice sliceToField converts a strings.slice to a field struct
   * @param fieldSlice the slice of a string representing the field of a cron job
   * @return the field
   */
  function sliceToField(strings.slice memory fieldSlice) private pure returns (Field memory) {
    strings.slice memory star = strings.toSlice("*");
    strings.slice memory dash = strings.toSlice("-");
    strings.slice memory slash = strings.toSlice("/");
    strings.slice memory comma = strings.toSlice(",");
    Field memory field;
    if (fieldSlice.equals(star)) {
      field.fieldType = FieldType.WILD;
    } else if (fieldSlice.contains(dash)) {
      field.fieldType = FieldType.RANGE;
      strings.slice memory start = fieldSlice.split(dash);
      field.rangeStart = sliceToUint8(start);
      field.rangeEnd = sliceToUint8(fieldSlice);
    } else if (fieldSlice.contains(slash)) {
      field.fieldType = FieldType.INTERVAL;
      fieldSlice.split(slash);
      field.interval = sliceToUint8(fieldSlice);
    } else if (fieldSlice.contains(comma)) {
      field.fieldType = FieldType.LIST;
      strings.slice memory token;
      while (fieldSlice.len() > 0) {
        if (field.listLength > 25) {
          revert ListTooLarge();
        }
        token = fieldSlice.split(comma);
        field.list[field.listLength] = sliceToUint8(token);
        field.listLength++;
      }
    } else {
      // needs input validation
      field.fieldType = FieldType.EXACT;
      field.singleValue = sliceToUint8(fieldSlice);
    }
    return field;
  }

  /**
   * @notice fieldToBstring converts a field to the bytes representation of that field string
   * @param field the field to stringify
   * @return bytes representing the string, ex: bytes("*")
   */
  function fieldToBstring(Field memory field) private pure returns (bytes memory) {
    if (field.fieldType == FieldType.WILD) {
      return "*";
    } else if (field.fieldType == FieldType.EXACT) {
      return uintToBString(uint256(field.singleValue));
    } else if (field.fieldType == FieldType.RANGE) {
      return bytes.concat(uintToBString(field.rangeStart), "-", uintToBString(field.rangeEnd));
    } else if (field.fieldType == FieldType.INTERVAL) {
      return bytes.concat("*/", uintToBString(uint256(field.interval)));
    } else if (field.fieldType == FieldType.LIST) {
      bytes memory result = uintToBString(field.list[0]);
      for (uint256 idx = 1; idx < field.listLength; idx++) {
        result = bytes.concat(result, ",", uintToBString(field.list[idx]));
      }
      return result;
    }
    revert UnknownFieldType();
  }

  /**
   * @notice uintToBString converts a uint256 to a bytes representation of that uint as a string
   * @param n the number to stringify
   * @return bytes representing the string, ex: bytes("1")
   */
  function uintToBString(uint256 n) private pure returns (bytes memory) {
    if (n == 0) {
      return "0";
    }
    uint256 j = n;
    uint256 len;
    while (j != 0) {
      len++;
      j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint256 k = len;
    while (n != 0) {
      k = k - 1;
      uint8 temp = (48 + uint8(n - (n / 10) * 10));
      bytes1 b1 = bytes1(temp);
      bstr[k] = b1;
      n /= 10;
    }
    return bstr;
  }

  /**
   * @notice sliceToUint8 converts a strings.slice to uint8
   * @param slice the string slice to convert to a uint8
   * @return the number that the string represents ex: "20" --> 20
   */
  function sliceToUint8(strings.slice memory slice) private pure returns (uint8) {
    bytes memory b = bytes(slice.toString());
    uint8 i;
    uint8 result = 0;
    for (i = 0; i < b.length; i++) {
      uint8 c = uint8(b[i]);
      if (c >= 48 && c <= 57) {
        result = result * 10 + (c - 48);
      }
    }
    return result;
  }
}


/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\chainlink\v0.8\libraries\external\Cron.sol
*/

pragma solidity 0.8.6;

////import {Cron as CronInternal, Spec} from "../internal/Cron.sol";

/**
 * @title The Cron library
 * @notice A utility contract for encoding/decoding cron strings (ex: 0 0 * * *) into an
 * abstraction called a Spec. The library also includes a spec function, nextTick(), which
 * determines the next time a cron job should fire based on the current block timestamp.
 * @dev this is the external version of the library, which relies on the internal library
 * by the same name.
 */
library Cron {
  using CronInternal for Spec;
  using CronInternal for string;

  /**
   * @notice nextTick calculates the next datetime that a spec "ticks", starting
   * from the current block timestamp. This is gas-intensive and therefore should
   * only be called off-chain.
   * @param spec the spec to evaluate
   * @return the next tick
   */
  function nextTick(Spec calldata spec) public view returns (uint256) {
    return spec.nextTick();
  }

  /**
   * @notice lastTick calculates the previous datetime that a spec "ticks", starting
   * from the current block timestamp. This is gas-intensive and therefore should
   * only be called off-chain.
   * @param spec the spec to evaluate
   * @return the next tick
   */
  function lastTick(Spec calldata spec) public view returns (uint256) {
    return spec.lastTick();
  }

  /**
   * @notice matches evaluates whether or not a spec "ticks" at a given timestamp
   * @param spec the spec to evaluate
   * @param timestamp the timestamp to compare against
   * @return true / false if they match
   */
  function matches(Spec calldata spec, uint256 timestamp) public view returns (bool) {
    return spec.matches(timestamp);
  }

  /**
   * @notice toSpec converts a cron string to a spec struct. This is gas-intensive
   * and therefore should only be called off-chain.
   * @param cronString the cron string
   * @return the spec struct
   */
  function toSpec(string calldata cronString) public pure returns (Spec memory) {
    return cronString.toSpec();
  }

  /**
   * @notice toEncodedSpec converts a cron string to an abi-encoded spec. This is gas-intensive
   * and therefore should only be called off-chain.
   * @param cronString the cron string
   * @return the abi-encoded spec
   */
  function toEncodedSpec(string calldata cronString) public pure returns (bytes memory) {
    return cronString.toEncodedSpec();
  }

  /**
   * @notice toCronString converts a cron spec to a human-readable cron string. This is gas-intensive
   * and therefore should only be called off-chain.
   * @param spec the cron spec
   * @return the corresponding cron string
   */
  function toCronString(Spec calldata spec) public pure returns (string memory) {
    return spec.toCronString();
  }
}

