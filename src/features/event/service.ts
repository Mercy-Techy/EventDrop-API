import { pool } from "../../config/database";
import Paginator from "../../utilities/paginator";
import { ServiceResponse } from "../../utilities/response";
import { file, FileService } from "../file/service";
import TokenService from "../token/token.service";
import { IUser } from "../user/dto";
import { AddEventDto, EditEventDto } from "./dto";

export class EventService {
  static async addEvent(
    user: IUser,
    body: AddEventDto,
    file?: file
  ): Promise<ServiceResponse> {
    try {
      const details = body;
      let logo_url = null;
      let logo_public_id = null;

      if (file) {
        const uploadedFile = await FileService.uploadFile(file.buffer, "event");
        if (uploadedFile) {
          logo_url = uploadedFile.url;
          logo_public_id = uploadedFile.public_id;
        }
      }
      const generated_link = await TokenService.generateLinkToken();
      const event = (
        await pool.query(
          `INSERT INTO events(title,description,event_location,event_date,event_time,link_expires_at,created_by,generated_link,logo_url,logo_public_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
          [
            ...Object.values(details),
            user.id,
            generated_link,
            logo_url,
            logo_public_id,
          ]
        )
      ).rows[0];
      return {
        status: true,
        message: "Event successfully added",
        data: event,
      };
    } catch (error: any) {
      return { status: false, message: error.message, data: error };
    }
  }

  static async editEvent(
    user: IUser,
    body: EditEventDto,
    file?: file
  ): Promise<ServiceResponse> {
    try {
      const { id, ...details } = body;
      const event = await (
        await pool.query(
          `SELECT * FROM events WHERE id = $1 AND created_by = $2`,
          [id, user.id]
        )
      ).rows[0];
      if (!event) throw new Error("Event does not exist");

      let logo_url = event.logo_url || null;
      let logo_public_id = event.logo_public_id || null;

      if (file) {
        if (event.avatar_url) {
          await FileService.deleteFile(event.logo_public_id);
        }
        const uploadedFile = await FileService.uploadFile(file.buffer, "event");
        if (uploadedFile) {
          logo_url = uploadedFile.url;
          logo_public_id = uploadedFile.public_id;
        }
      }
      const updatedEvent = (
        await pool.query(
          `UPDATE events SET title = $1,description = $2,event_location = $3,event_date = $4,event_time = $5,link_expires_at = $6,logo_url = $7,logo_public_id = $8, updated_at = $9 WHERE id = $10 RETURNING *`,
          [
            ...Object.values(details),
            logo_url,
            logo_public_id,
            new Date(),
            event.id,
          ]
        )
      ).rows[0];
      return {
        status: true,
        message: "Event successfully added",
        data: updatedEvent,
      };
    } catch (error: any) {
      return { status: false, message: error.message, data: error };
    }
  }

  // endpoint is used by event owner to upload images
  static async uploadImage(
    userId: string,
    eventId: string,
    image: file
  ): Promise<ServiceResponse> {
    try {
      if (!image) throw new Error("Kindly upload the image");
      const event = (
        await pool.query(
          `SELECT * FROM events WHERE id = $1 AND created_by = $2`,
          [eventId, userId]
        )
      ).rows[0];
      if (!event) throw new Error("Event does not exist");
      const uploadedImage = await FileService.uploadFile(image.buffer);
      if (!uploadedImage) throw new Error("Error uploading image");
      const savedImage = (
        await pool.query(
          `INSERT INTO images(event_owner,created_by,event_id,image_url,image_public_id) VALUES($1,$2,$3,$4,$5) RETURNING *`,
          [
            userId,
            "event_owner",
            eventId,
            uploadedImage.url,
            uploadedImage.public_id,
          ]
        )
      ).rows[0];
      return {
        status: true,
        message: "Image uploaded",
        data: savedImage,
      };
    } catch (error: any) {
      return { status: false, message: error.message, data: error };
    }
  }

  // endpoint is used by visitors to upload images
  static async uploadImageByVisitors(
    generated_link: string,
    image: file,
    ip: string
  ): Promise<ServiceResponse> {
    try {
      if (!image) throw new Error("Kindly upload the image");
      const event = (
        await pool.query(`SELECT * FROM events WHERE generated_link = $1`, [
          generated_link,
        ])
      ).rows[0];
      if (!event) throw new Error("Event does not exist");
      const uploadedImage = await FileService.uploadFile(image.buffer);
      if (!uploadedImage) throw new Error("Error uploading image");
      const savedImage = (
        await pool.query(
          `INSERT INTO images(visitor,event_id,image_url,image_public_id) VALUES($1,$2,$3,$4) RETURNING *`,
          [ip, event.id, uploadedImage.url, uploadedImage.public_id]
        )
      ).rows[0];
      return {
        status: true,
        message: "Image uploaded",
        data: savedImage,
      };
    } catch (error: any) {
      return { status: false, message: error.message, data: error };
    }
  }

  //fetch list of events by events owner
  static async fetchEvents(
    userId: string,
    page: number,
    limit: number
  ): Promise<ServiceResponse> {
    try {
      const data = await Paginator({
        table: "events e",
        join: "INNER JOIN users u ON e.created_by = u.id",
        filter: "created_by = $1",
        filterValues: [userId],
        sort: "created_at DESC",
        page,
        select: "e.*, u.firstname, u.lastname, u.avatar_url",
        limit,
      });
      return { status: true, message: "Events", data };
    } catch (error: any) {
      return { status: true, message: error.message, data: error };
    }
  }

  // After event owner clicks on an event, this endpoint is called to fetch the event images
  static async fetchEventImages(
    event: string,
    page: number,
    limit: number
  ): Promise<ServiceResponse> {
    try {
      const eventImages = await Paginator({
        table: "images",
        filter: "event_id = $1",
        page,
        limit,
        filterValues: [event],
      });
      return { status: true, message: "Event images", data: eventImages };
    } catch (error: any) {
      return { status: true, message: error.message, data: error };
    }
  }

  // visitors use this endpoint to fetch the event the link is attached to
  static async fetchEventByLink(
    generated_link: string
  ): Promise<ServiceResponse> {
    try {
      const event = (
        await pool.query(
          `SELECT e.*, u.lastname, u.firstname, u.avatar_url FROM events e INNER JOIN users u ON e.created_by = u.id WHERE generated_link = $1`,
          [generated_link]
        )
      ).rows[0];
      if (!event) throw new Error("Event does not exist");
      return { status: true, message: "Event details", data: event };
    } catch (error: any) {
      return { status: true, message: error.message, data: error };
    }
  }
}
