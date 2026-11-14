/**
 * Parse the output of PostgreSQL's pg_get_triggerdef() into structured fields.
 * Format: "CREATE TRIGGER <name> <timing> <events> ON <table> [FOR EACH <level>] EXECUTE FUNCTION <func>"
 * Example: "CREATE TRIGGER foo BEFORE INSERT ON schema.table FOR EACH ROW EXECUTE FUNCTION func()"
 */

type ParseTriggerDefReturnType = {
  event_manipulation: string;
  action_timing: string;
  trigger_level: string;
};

export const parseTriggerDef = (
  triggerDef: string,
): ParseTriggerDefReturnType => {
  // Match timing: BEFORE | AFTER | INSTEAD OF
  const timingMatch =
    /CREATE TRIGGER\s+\S+\s+(BEFORE|AFTER|INSTEAD OF)\b/i.exec(triggerDef);
  const action_timing = timingMatch ? timingMatch[1].toUpperCase() : 'UNKNOWN';

  // Match events: INSERT, UPDATE, DELETE, TRUNCATE, or combos like "INSERT OR UPDATE OR DELETE"
  const eventStart = timingMatch
    ? timingMatch.index + timingMatch[0].length
    : 0;
  const afterTiming = triggerDef.slice(eventStart);
  const eventMatch =
    /\b((?:INSERT|UPDATE|DELETE|TRUNCATE)(?:\s+OR\s+(?:INSERT|UPDATE|DELETE|TRUNCATE))*)\b/i.exec(
      afterTiming,
    );
  const event_manipulation = eventMatch
    ? eventMatch[1].toUpperCase()
    : 'UNKNOWN';

  // Match level: FOR EACH ROW | FOR EACH STATEMENT
  const levelMatch = /FOR EACH\s+(ROW|STATEMENT)\b/i.exec(triggerDef);
  const trigger_level = levelMatch ? levelMatch[1].toUpperCase() : 'UNKNOWN';

  return { event_manipulation, action_timing, trigger_level };
};
