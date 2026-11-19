import { findPhoneNumbersInText } from "libphonenumber-js";
import { Phone } from "lucide-react";

// Flag images rather than flag emoji: Windows does not draw flag emoji and
// shows two plain letters ("IN", "US") instead.
const flagSrc = (iso, width) =>
  `https://flagcdn.com/w${width}/${iso.toLowerCase()}.png`;

const regionName = (iso) => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(iso) || iso;
  } catch {
    return iso;
  }
};

/**
 * Shows each phone number in `text` on its own line with its country flag.
 * `text` is the string from contactPhonesText(). Numbers are found anywhere
 * in it, whatever the separators or labels, as long as they carry a country
 * code (+91 ..., +1 ...). If none can be read, the text is shown as before
 * with a plain phone icon.
 */
export default function PhoneNumbersWithFlags({ text }) {
  if (!text) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="text-muted-foreground">No phone number</span>
      </div>
    );
  }

  let found = [];
  try {
    found = findPhoneNumbersInText(text);
  } catch {
    found = [];
  }

  if (found.length === 0) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span title={text} className="truncate text-foreground">
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {found.map(({ number }, i) => {
        const iso = number.country;
        return (
          <div key={`${number.number}-${i}`} className="flex items-center gap-2 min-w-0">
            {iso ? (
              <img
                src={flagSrc(iso, 20)}
                srcSet={`${flagSrc(iso, 40)} 2x`}
                width={16}
                height={12}
                alt={regionName(iso)}
                title={regionName(iso)}
                loading="lazy"
                className="h-3 w-4 shrink-0 rounded-[2px] object-cover ring-1 ring-border/60"
              />
            ) : (
              <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            <a
              href={number.getURI()}
              onClick={(e) => e.stopPropagation()}
              className="truncate text-foreground hover:text-primary"
            >
              {number.formatInternational()}
            </a>
          </div>
        );
      })}
    </div>
  );
}