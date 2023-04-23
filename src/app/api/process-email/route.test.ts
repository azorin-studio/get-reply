import nock from 'nock'

describe('process-email-route', () => {
  it('Runs the entire route', async () => {
    nock('https://api.example.com')
      .get('/')
      .reply(200, {
          data: {
              id: 1,
              title: "The weather is nice",
              completed: true
          }
      });
    const results = await getData();
    expect(results.data.title).toEqual("The weather is nice");
  })

})
