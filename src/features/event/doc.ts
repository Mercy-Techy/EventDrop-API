import docFormatter from "../../swagger/docFormatter";

export const eventDocs = {
  "/event/add": docFormatter(
    "post",
    "Event",
    "Add Event",
    true,
    [],
    null,
    {
      title: { type: "string", example: "Annual tech event" },
      description: {
        type: "string",
        example:
          "an event where all tech companies gather together to rub minds together",
      },
      event_location: { type: "string", example: "Lagos state" },
      event_date: { type: "string", example: "22-11-2025" },
      event_time: { type: "string", example: "12:00" },
      link_expires_at: { type: "number", example: 10 },
      logo: { type: "string", format: "binary" },
    },
    {},
    "multipart/form-data"
  ),
  "/event/edit": docFormatter(
    "put",
    "Event",
    "Edit Event",
    true,
    [],
    null,
    {
      id: { type: "string", example: "3bc95fd9-55d0-4436-b6d8-711c507b955e" },
      title: { type: "string", example: "Annual tech event" },
      description: {
        type: "string",
        example:
          "an event where all tech companies gather together to rub minds together",
      },
      event_location: { type: "string", example: "Lagos state" },
      event_date: { type: "string", example: "22-11-2025" },
      event_time: { type: "string", example: "12:00" },
      link_expires_at: { type: "number", example: 10 },
      logo: { type: "string", format: "binary" },
    },
    {},
    "multipart/form-data"
  ),
  "/event/fetch": docFormatter(
    "get",
    "Event",
    "Fetch all events owned by user",
    true,
    [],
    "default"
  ),
  "/event/upload-image/{eventId}": docFormatter(
    "post",
    "Event",
    "Upload image to an event",
    true,
    [{ in: "path", name: "eventId", schema: { type: "string" } }],
    null,
    {
      image: { type: "string", format: "binary" },
    },
    {},
    "multipart/form-data"
  ),
  "/event/upload-image-visitor/{generated_link}": docFormatter(
    "post",
    "Event",
    "Upload image to an event by visitors",
    false,
    [{ in: "path", name: "generated_link", schema: { type: "string" } }],
    null,
    {
      image: { type: "string", format: "binary" },
    },
    {},
    "multipart/form-data"
  ),
  "/event/fetch-images/{eventId}": docFormatter(
    "get",
    "Event",
    "Fetch event images",
    false,
    [{ in: "path", name: "eventId", schema: { type: "string" } }],
    "add"
  ),
  "/event/fetch-event/{generated_link}": docFormatter(
    "get",
    "Event",
    "Fetch event",
    false,
    [{ in: "path", name: "generated_link", schema: { type: "string" } }]
  ),
};
