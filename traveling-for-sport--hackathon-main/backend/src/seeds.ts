import { MatchModel } from './models/Match.model.js';

export async function seedMatches() {
  try {
    // Check if matches already exist
    const existingMatches = await MatchModel.countDocuments();
    if (existingMatches > 0) {
      console.log('✅ Matches already seeded');
      return;
    }

    const worldCupMatches = [
      {
        homeTeam: 'USA',
        awayTeam: 'Mexico',
        date: new Date('2026-06-15T20:00:00Z'),
        stage: 'Group Stage',
        venue: 'MetLife Stadium',
        city: 'East Rutherford, NJ',
      },
      {
        homeTeam: 'Argentina',
        awayTeam: 'Brazil', 
        date: new Date('2026-06-18T16:00:00Z'),
        stage: 'Group Stage',
        venue: 'SoFi Stadium',
        city: 'Los Angeles, CA',
      },
      {
        homeTeam: 'England',
        awayTeam: 'Germany',
        date: new Date('2026-06-20T14:00:00Z'),
        stage: 'Group Stage',
        venue: 'Soldier Field',
        city: 'Chicago, IL',
      },
      {
        homeTeam: 'France',
        awayTeam: 'Spain',
        date: new Date('2026-06-22T18:00:00Z'),
        stage: 'Group Stage',
        venue: 'AT&T Stadium',
        city: 'Arlington, TX',
      },
      {
        homeTeam: 'Netherlands',
        awayTeam: 'Portugal',
        date: new Date('2026-06-25T20:00:00Z'),
        stage: 'Round of 16',
        venue: 'Mercedes-Benz Stadium',
        city: 'Atlanta, GA',
      },
      {
        homeTeam: 'Italy',
        awayTeam: 'Croatia',
        date: new Date('2026-06-28T16:00:00Z'),
        stage: 'Round of 16',
        venue: 'Hard Rock Stadium',
        city: 'Miami Gardens, FL',
      },
      {
        homeTeam: 'Belgium',
        awayTeam: 'Colombia',
        date: new Date('2026-07-02T18:00:00Z'),
        stage: 'Quarter Final',
        venue: 'Levi\'s Stadium',
        city: 'Santa Clara, CA',
      },
      {
        homeTeam: 'Morocco',
        awayTeam: 'Japan',
        date: new Date('2026-07-05T14:00:00Z'),
        stage: 'Quarter Final',
        venue: 'Lincoln Financial Field',
        city: 'Philadelphia, PA',
      },
      {
        homeTeam: 'TBD',
        awayTeam: 'TBD',
        date: new Date('2026-07-10T20:00:00Z'),
        stage: 'Semi Final',
        venue: 'Rose Bowl',
        city: 'Pasadena, CA',
      },
      {
        homeTeam: 'TBD',
        awayTeam: 'TBD',
        date: new Date('2026-07-14T15:00:00Z'),
        stage: 'Final',
        venue: 'MetLife Stadium',
        city: 'East Rutherford, NJ',
      },
    ];

    await MatchModel.insertMany(worldCupMatches);
    console.log('✅ World Cup 2026 matches seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding matches:', error);
  }
}