var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var spy = require("sinon").spy;
var events = require('../src/events');
var domain = require('../src/domain');
var commands = require('../src/commands');
var cqrsTest = require('@tapmiapp/cqrs-test');

describe('Project aggregate root', function () {

    var eventHandlers,
        id = 'id',
        name = 'name',
        description = 'description',
        userId = 'userId',
        timestamp = new Date();

    before(function () {
        cqrsTest.init(
            function () { return new domain.Project(); },
            function (aggregateRootRepository) { return new commands.CommandHandlers(aggregateRootRepository); },
            events);

        eventHandlers = cqrsTest.getEventHandlers();
    });

    describe('create project', function () {

        before(function (done) {
            //given

            //when
            cqrsTest.when(new commands.Commands.CreateProject(id, name, description, userId), function (err) {
                expect(err).to.be.null;
                done();
            });
        });

        it('triggers event', function () {
            assert(eventHandlers.handleProjectCreated.calledOnce);
            var event = eventHandlers.handleProjectCreated.firstCall.args[0];
            expect(event.id).to.equal(id);
            expect(event.name).to.equal(name);
            expect(event.description).to.equal(description);
            expect(event.userId).to.equal(userId);
            expect(event.version).to.equal(0);
        });

    });

    describe('create project twice', function () {

        before(function (done) {
            cqrsTest.given([{
                        aggregateId: id,
                        eventData: new events.ProjectCreated(id, name, description, userId, timestamp),
                        version: 1
                    }],
                function () {
                    done();
                });
        });

        it('return error', function (done) {
            cqrsTest.when(new commands.Commands.CreateProject(id, name, description, userId), function (err) {
                expect(err).to.not.be.null;
                expect(err.message).to.equal('ConcurrencyException');
                done();
            });
        });

    });

    describe('create project with no id', function () {

        it('throws error', function () {
            var sendInvalidCommand = function () {
                cqrsTest.when(new commands.Commands.CreateProject(null, name, description, userId));
            };

            expect(sendInvalidCommand).to.throw();
        });

    });

    describe('create project with no name', function () {

        it('returns error', function (done) {
            cqrsTest.when(new commands.Commands.CreateProject(id, null, description, userId), function (err) {
                expect(err).to.not.be.null;
                done();
            });
        });

    });

    describe('create project with no userId', function () {

        it('returns error', function (done) {
            cqrsTest.when(new commands.Commands.CreateProject(id, name, description, null), function (err) {
                expect(err).to.not.be.null;
                done();
            });
        });

    });

});

