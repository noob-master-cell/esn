import { Controller, Get, Res } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { Response } from 'express';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) { }

    @Get('feed')
    async getFeed(@Res() res: Response) {
        const calendar = await this.calendarService.getCalendarFeed();

        res.set('Content-Type', 'text/calendar; charset=utf-8');
        res.set('Content-Disposition', 'attachment; filename="events.ics"');
        res.send(calendar.toString());
    }
}
