interface Timestamp {
  start: number;
  end: number;
  value: string;
}

interface subtitleObject {
  index: string;
  timestamp: Timestamp;
  text: string;
}

export function parseTimestampToMs(timestamp: string): number {
  const match = timestamp.match(/^(?:(\d{1,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);

  if (!match) {
    throw new Error('Invalid format: "' + timestamp + '"');
  }

  const hours = match[1] ? parseInt(match[1], 10) * 3600000 : 0;
  const minutes = parseInt(match[2], 10) * 60000;
  const seconds = parseInt(match[3], 10) * 1000;
  const milliseconds = parseInt(match[4], 10);

  return hours + minutes + seconds + milliseconds;
}

export function isIntervalslOverlap(timestampOne: Timestamp, timestampTwo: Timestamp): boolean {
  return (
    (timestampTwo.start < timestampOne.end && timestampTwo.end > timestampOne.start) ||
    (timestampOne.start < timestampTwo.end && timestampOne.end > timestampTwo.start)
  );
}

export function parseText(text: string | undefined): subtitleObject[] | undefined {
  const indexRegex = /([0-9]+)/;
  const timestampRegex =
    /^(?:(\d{1,}):)?(\d{2}):(\d{2})[,.](\d{3})( --> )(?:(\d{1,}):)?(\d{2}):(\d{2})[,.](\d{3})$/m;

  const sections = text?.match(
    new RegExp(indexRegex.source + '\n' + timestampRegex.source + '\n(.*?)\n\n', 'gms')
  );

  const parsed: subtitleObject[] | undefined = sections?.map((section) => {
    const index = (section.match(indexRegex) as RegExpMatchArray)[0];
    const timestamp = (section.match(timestampRegex) as RegExpMatchArray)[0];
    const timestamps = timestamp.split(' --> ');
    const text = section.replace(
      new RegExp(indexRegex.source + '\n' + timestampRegex.source + '\n'),
      ''
    );

    return {
      index,
      timestamp: {
        start: parseTimestampToMs(timestamps[0]) / 1000,
        end: parseTimestampToMs(timestamps[1]) / 1000,
        value: timestamp
      },
      text
    };
  });

  return parsed;
}
