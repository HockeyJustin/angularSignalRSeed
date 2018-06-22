# Angular SignalR Boostrap Seed 

(contains tour of heroes tutorial - see below)

## Setup (inc Chat Hub for signalR)

1. Create an MVC5 server with a ChatHub as detailed [here](https://docs.microsoft.com/en-us/aspnet/signalr/overview/getting-started/tutorial-getting-started-with-signalr-and-mvc)

2. To the ChatHub, add the following code

```C#
		/// <summary>
        /// Angular version.
        /// </summary>
        /// <param name="connectionId">The signalR connection to return to</param>
        /// <param name="chatMessage">The message</param>
        public void SendFromAngular(string connectionId, ChatMessage chatMessage)
        {
            chatMessage.Message = "Server hit!:" + chatMessage.Message;
            Clients.Client(connectionId).serverMessageBackToClientOnly(chatMessage);
        }
```

3. For the mvc project, add a cors policy. Easiest is to do `Install-Package Microsoft.Owin.Cors` and to Startup.cs add the cors policy:

```C#
public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll); //unsafe - tighten for production!
            app.MapSignalR();

            ConfigureAuth(app);
        }
    }

```

4. Clone this repro (if you haven't already)

5. Start the server running.

6. In Back in the client, go to src/app/services/signal-rservice.service (can you tell it was done in a rush?), set the hubConnection to the correct url.

5. Navigate to the project in the command line and `ng serve` as you would with the 'tour of heroes' tutorial (might need to do `npm install` first time round).



----------------------------------------------------

# AngularTourOfHeroes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.




## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
